import { getStoredIds } from "@/utils/secureStore";
import { router, Stack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../services/api";

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  instructorId: number;
  level: string;
  duration: string;
  rating: string;
  price: string;
}
interface Instructor {
  id: number;
  name: string;
  avatar: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const [coursesRes, instructorsRes] = await Promise.all([
        api.get(`/public/randomproducts?page=${pageNumber}&limit=10`),
        pageNumber === 1
          ? api.get("/public/randomusers")
          : Promise.resolve({ data: { data: { data: instructors } } }),
      ]);

      const coursesArray = coursesRes.data?.data?.data || [];
      const instructorsArray = instructorsRes.data?.data?.data || [];

      const levels = ["Beginner", "Intermediate", "Advanced"];

      const coursesData: Course[] = coursesArray.map(
        (item: any, index: number) => ({
          id: item.id || (pageNumber - 1) * 10 + index,
          title: `${item.title} Masterclass`,
          description: `Comprehensive training on ${item.title}. ${item.description}`,
          thumbnail: item.thumbnail || "https://via.placeholder.com/150",
          instructorId: index % instructorsArray.length,
          level: levels[index % 3],
          duration: `${8 + index} Hours`,
          rating: (4 + Math.random()).toFixed(1),
          price: `$${item.price || 49}`,
        }),
      );

      const instructorsData: Instructor[] =
        pageNumber === 1
          ? instructorsArray.map((item: any, index: number) => {
              let instructorName = `Instructor ${index + 1}`;

              if (item.name) {
                if (typeof item.name === "string") {
                  instructorName = item.name;
                } else if (item.name.first && item.name.last) {
                  instructorName = `${item.name.first} ${item.name.last}`;
                }
              }

              return {
                id: item.id || index,
                name: instructorName,
                avatar: item.avatar || "https://via.placeholder.com/50",
              };
            })
          : instructors;

      setCourses((prev) =>
        pageNumber === 1 ? coursesData : [...prev, ...coursesData],
      );
      if (pageNumber === 1) setInstructors(instructorsData);

      if (coursesData.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.log("Courses fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData();
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const saved = await getStoredIds("bookmarks");
    setBookmarks(saved);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const toggleBookmark = (courseId: number) => {
    setBookmarks((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, courses]);

  const getInstructorName = (id: number) => {
    const instructor = instructors.find((i) => i.id === id);
    return instructor ? instructor.name : "Unknown";
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Courses" }} />
      <View style={styles.container}>
        <TextInput
          placeholder="Search courses..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.courseCard}
              onPress={() => router.push(`/${item.id}`)}
            >
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.courseTitle}>{item.title}</Text>

                <Text style={styles.meta}>
                  {item.level} • {item.duration}
                </Text>

                <Text style={styles.instructor}>
                  Instructor: {getInstructorName(item.instructorId)}
                </Text>

                <Text numberOfLines={2} style={styles.description}>
                  {item.description}
                </Text>

                <View style={styles.bottomRow}>
                  <Text style={styles.rating}>⭐ {item.rating}</Text>
                  <Text style={styles.price}>{item.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
          onEndReached={() => {
            if (hasMore && !loadingMore) {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchData(nextPage);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color="#2563eb" />
            ) : null
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f2f4f7" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchInput: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
  },
  thumbnail: { width: 80, height: 80, borderRadius: 8 },
  courseTitle: { fontWeight: "bold", fontSize: 16 },
  instructor: { fontSize: 12, color: "#555", marginVertical: 2 },
  description: { fontSize: 12, color: "#666" },
  meta: {
    fontSize: 13,
    color: "#6b7280",
    marginVertical: 2,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  rating: {
    fontSize: 14,
    fontWeight: "600",
  },

  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563eb",
  },
});
