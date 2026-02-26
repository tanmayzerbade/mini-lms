import { useAuthStore } from "@/store/useAuthStore";
import { getStoredIds } from "@/utils/secureStore";
import { router, Stack } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

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

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();

  const fetchData = async () => {
    try {
      setLoading(true);

      const enrolled = await getStoredIds("enrollments");
      setEnrolledIds(enrolled);

      const res = await api.get("/public/randomproducts");
      const coursesArray = res.data?.data?.data || [];

      const levels = ["Beginner", "Intermediate", "Advanced"];

      const transformed: Course[] = coursesArray.map(
        (item: any, index: number) => ({
          id: item.id || index,
          title: `${item.title} Masterclass`,
          description: `Comprehensive training on ${item.title}. ${item.description}`,
          thumbnail: item.thumbnail || "https://via.placeholder.com/150",
          instructorId: index,
          level: levels[index % 3],
          duration: `${8 + index} Hours`,
          rating: (4 + Math.random()).toFixed(1),
          price: `$${item.price || 49}`,
        }),
      );

      setCourses(transformed);
    } catch (error) {
      console.log("My Courses error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const enrolledCourses = useMemo(() => {
    return courses.filter((course) => enrolledIds.includes(course.id));
  }, [courses, enrolledIds]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "My Courses" }} />
      <View style={styles.container}>
        {enrolledCourses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You haven't enrolled in any courses yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={enrolledCourses}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/[id]",
                    params: { id: item.id.toString() },
                  })
                }
              >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>
                  {item.level} • {item.duration}
                </Text>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f2f4f7",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  meta: {
    fontSize: 13,
    color: "#6b7280",
    marginVertical: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
});
