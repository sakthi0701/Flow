import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { ColorScheme } from '../../types/theme'; // <-- 1. Import ColorScheme

type QuadrantProps = {
  title: string;
  subtitle: string;
  gradient: {
    from: string;
    to: string;
  };
};

const Quadrant: React.FC<QuadrantProps> = ({ title, subtitle, gradient }) => {
  // 2. Cast the theme to get the correct colors type
  const theme = useTheme();
  const colors: ColorScheme = {
    ...theme.colors,
    tint: theme.colors.primary,
    icon: theme.colors.text,
    tabIconDefault: theme.colors.border,
    tabIconSelected: theme.colors.primary,
    primary: theme.colors.primary,
    subtle: theme.colors.border,
    accent: {
      blue: '#67E8F9',
      mint: '#A7F3D0',
      lavender: '#8E85FF'
    }
  };
  
  return (
    <View
      style={[
        styles.quadrant,
        {
          backgroundColor: gradient.from + '20',
        }
      ]}
    >
      <Text style={[styles.quadrantTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.quadrantSubtitle, { color: colors.subtle }]}>{subtitle}</Text>
    </View>
  );
};

export const PriorityMatrix: React.FC = () => {
  // 3. Cast the theme here as well
  const theme = useTheme();
  const colors: ColorScheme = {
    ...theme.colors,
    tint: theme.colors.primary,
    icon: theme.colors.text,
    tabIconDefault: theme.colors.border,
    tabIconSelected: theme.colors.primary,
    primary: theme.colors.primary,
    subtle: theme.colors.border,
    accent: {
      blue: '#67E8F9',
      mint: '#A7F3D0',
      lavender: '#8E85FF'
    }
  };
  
  const quadrants: QuadrantProps[] = [
    {
      title: 'Urgent & Important',
      subtitle: 'Do it now',
      gradient: {
        from: colors.accent?.mint || '#A7F3D0',
        to: colors.accent?.mint || '#A7F3D0',
      },
    },
    {
      title: 'Not Urgent & Important',
      subtitle: 'Schedule it',
      gradient: {
        from: colors.accent?.blue || '#67E8F9',
        to: colors.accent?.lavender || '#8E85FF',
      },
    },
    {
      title: 'Urgent & Not Important',
      subtitle: 'Delegate it',
      gradient: {
        from: colors.accent?.mint || '#A7F3D0',
        to: colors.accent?.blue || '#67E8F9',
      },
    },
    {
      title: 'Not Urgent & Not Important',
      subtitle: 'Eliminate it',
      gradient: {
        from: colors.accent?.lavender || '#8E85FF',
        to: colors.accent?.mint || '#A7F3D0',
      },
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
    backgroundColor: '#fff',
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