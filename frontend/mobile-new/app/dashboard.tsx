// app/dashboard.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
// Adjust paths if needed
import { PriorityMatrix } from '../src/components/priority-matrix'; // Use the styled one
import { Goals } from '../src/components/goals'; // Use the styled one
import { ClassesList } from '../src/components/ClassesList'; // Or a styled version if you create one

// Assuming you have theme context setup for Expo Router layout, otherwise import colors directly
// import { useTheme } from '@react-navigation/native';

export default function DashboardTabLayout() {
    // const { colors } = useTheme(); // Use if theme is available

    // Structure based on image_896ce2.jpg
    return (
        <ScrollView style={styles.container /* { backgroundColor: colors.background } */}>
            {/* Header */}
            <View style={styles.headerContainer}>
                 {/* Add profile icon/image here */}
                 <Text style={styles.headerTitle /* { color: colors.text } */}>Dashboard</Text>
            </View>

            {/* Priority Matrix Section */}
            {/* Assuming PriorityMatrix component matches the image's structure */}
            <PriorityMatrix />

            {/* Goals Section */}
            {/* Assuming Goals component matches the image's structure */}
            <Goals />

            {/* Classes Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle /* { color: colors.text } */}>Classes</Text>
                {/* You might need a dedicated Classes component styled like the image */}
                {/* For now, using ClassesList */}
                 <View style={styles.listContainer /* { backgroundColor: colors.card } */}>
                    <ClassesList />
                    {/* Add "All Tasks" links if needed */}
                 </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Example background
    },
    headerContainer: {
        paddingTop: 60, // Adjust for status bar
        paddingBottom: 20,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        // Add styles for profile icon positioning
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10, // Adjust spacing from icon
    },
    sectionContainer: {
         paddingHorizontal: 16,
         marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    listContainer: {
        borderRadius: 15,
        // Add padding/margin if ClassesList doesn't include it
        // Add shadow/elevation if needed
    },
    // Add any other specific styles needed
});