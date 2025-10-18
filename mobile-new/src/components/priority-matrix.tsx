import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

type QuadrantProps = {
  title: string;
  subtitle: string;
  color: string;
};

const Quadrant: React.FC<QuadrantProps> = ({ title, subtitle, color }) => {
  const { colors } = useTheme();
  
  return (
    <View
      style={[
        styles.quadrant,
        {
          backgroundColor: color + '20',
          borderLeftColor: color,
        }
      ]}
    >
      <Text style={[styles.quadrantTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.quadrantSubtitle, { color: colors.text }]}>{subtitle}</Text>
    </View>
  );
};

export const PriorityMatrix: React.FC = () => {
  const { colors } = useTheme();
  
  const quadrants: QuadrantProps[] = [
    {
      title: 'Urgent & Important',
      subtitle: 'Do it now',
      color: '#A7F3D0',
    },
    {
      title: 'Not Urgent & Important',
      subtitle: 'Schedule it',
      color: '#67E8F9',
    },
    {
      title: 'Urgent & Not Important',
      subtitle: 'Delegate it',
      color: '#8E85FF',
    },
    {
      title: 'Not Urgent & Not Important',
      subtitle: 'Eliminate it',
      color: '#F87171',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Priority Matrix</Text>
        <View style={[styles.select, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.selectText, { color: colors.text }]}>All Categories</Text>
        </View>
      </View>
      <View style={styles.grid}>
        {quadrants.map((quadrant, index) => (
          <Quadrant key={index} {...quadrant} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  select: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectText: {
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quadrant: {
    width: '47%',
    padding: 16,
    borderRadius: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quadrantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quadrantSubtitle: {
    fontSize: 14,
  },
});