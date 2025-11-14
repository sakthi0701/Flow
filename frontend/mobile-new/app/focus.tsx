// app/focus.tsx
import React from 'react';
import { View } from 'react-native';
// Adjust path if your components folder is elsewhere
import { FocusTimer } from '../src/components/focus-timer'; // Use the more detailed timer

export default function FocusScreen() {
    // The FocusTimer component is self-contained and includes the header
    // and layout from the image. No extra Views or styles are needed here.
    return (
        <View style={{ flex: 1 }}>
            <FocusTimer />
        </View>
    );
}