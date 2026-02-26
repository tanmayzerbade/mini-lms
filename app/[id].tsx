import { getStoredIds, toggleStoredId } from "@/utils/secureStore";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

export default function CourseDetails() {
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    fetchCourse();
    checkBookmark();
    checkEnrollment();
  }, []);

  const checkEnrollment = async () => {
    const enrolledCourses = await getStoredIds("enrollments");
    setEnrolled(enrolledCourses.includes(Number(id)));
  };

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/public/randomproducts/${id}`);
      setCourse(res.data.data);
    } catch (err) {
      console.log("Course details error:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkBookmark = async () => {
    const saved = await getStoredIds("bookmarks");
    setBookmarked(saved.includes(Number(id)));
  };

  const handleToggleBookmark = async () => {
    console.log("Bookmark pressed");
    const updated = await toggleStoredId("bookmarks", Number(id));
    setBookmarked(updated.includes(Number(id)));
  };

  const handleEnroll = async () => {
    const updated = await toggleStoredId("enrollments", Number(id));
    const isNowEnrolled = updated.includes(Number(id));
    setEnrolled(isNowEnrolled);

    if (isNowEnrolled) {
      router.push({
        pathname: "/webview",
        params: { title: course.title },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!course) return null;

  return (
    <>
      <Stack.Screen options={{ title: "Course Details" }} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <View style={styles.tagRow}>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>PREMIUM COURSE</Text>
              </View>
              <View style={styles.ratingBox}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={styles.ratingText}>4.8 (1.2k reviews)</Text>
              </View>
            </View>

            <Text style={styles.title}>{course.title}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color="#64748b" />
                <Text style={styles.statText}>12 Hours</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="bar-chart-outline" size={20} color="#64748b" />
                <Text style={styles.statText}>Beginner</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="people-outline" size={20} color="#64748b" />
                <Text style={styles.statText}>Enrolled</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>About this course</Text>
            <Text style={styles.description}>{course.description}</Text>

            <Text style={styles.sectionTitle}>What you'll learn</Text>
            {[
              "Expert-led instruction",
              "Lifetime access",
              "Hands-on projects",
            ].map((item, i) => (
              <View key={i} style={styles.learningItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.learningText}>{item}</Text>
              </View>
            ))}
            <View style={{ height: 100 }} />
            <View style={styles.imageWrapper}>
              <Image source={{ uri: course.thumbnail }} style={styles.image} />

              <TouchableOpacity
                onPress={handleToggleBookmark}
                style={styles.bookmarkButton}
              >
                <Ionicons
                  name={bookmarked ? "bookmark" : "bookmark-outline"}
                  size={24}
                  color={bookmarked ? "#2563eb" : "#fff"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {!enrolled ? (
            <TouchableOpacity style={styles.enrollBtn} onPress={handleEnroll}>
              <Text style={styles.buttonText}>Enroll Now — Free</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.enrollBtn, { backgroundColor: "#10b981" }]}
              onPress={() =>
                router.push({
                  pathname: "/webview",
                  params: { title: course.title },
                })
              }
            >
              <Text style={styles.buttonText}>Continue Learning</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 280 },
  contentContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -40,
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: { color: "#2563eb", fontSize: 12, fontWeight: "800" },
  ratingBox: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 4, color: "#64748b", fontSize: 13 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 16,
    lineHeight: 32,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statItem: { flexDirection: "row", alignItems: "center" },
  statText: { marginLeft: 6, color: "#64748b", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
    marginBottom: 20,
  },
  learningItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  learningText: { marginLeft: 10, color: "#475569", fontSize: 15 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  iconCircle: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingBottom: 34, // Extra padding for iPhones with home bars
  },
  enrollBtn: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },

  bookmarkButton: {
    position: "absolute",
    top: 80, // adjust based on your header height
    right: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 30,
  },
  imageWrapper: {
    bottom: "30%",
  },
});
