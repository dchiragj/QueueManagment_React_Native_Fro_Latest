
import React, { useState, useEffect } from 'react';
import AppStyles from '../../styles/AppStyles';
import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import NavigationOptions from '../../components/NavigationOptions';
import { colors } from '../../styles';
import screens from '../../constants/screens';
import Input from '../../components/Input';
import TextView from '../../components/TextView/TextView';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { borderRadius } from '../../styles/dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import { getCategories } from '../../services/apiService';
// import utility from '../../utility'; // Import utility for toast notification

const Categories = (props) => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Store all categories for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data.data || []);
      setAllCategories(data.data || []); // Store all categories initially
    } catch (err) {
      setError(err.message);
      utility.ToastNotification(err.message); // Show error via toast
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filteredCategories = allCategories.filter((category) =>
        category.name.toLowerCase().includes(text.toLowerCase())
      );
      setCategories(filteredCategories);
    } else {
      setCategories(allCategories); // Reset to all categories if search is empty
    }
  };

  const onPressCategories = (category) => {
    props.navigation.navigate(screens.CustomerQueueList, { category });
  };

  if (loading) {
    return (
      <SafeAreaView style={[AppStyles.root]}>
        <ActivityIndicator size="large" color={colors.white} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[AppStyles.root]}>
        <TextView text={error} type={'body-one'} color={colors.lightWhite} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[AppStyles.root]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input
          placeholder='Search Category'
          isIconLeft={true}
          leftIconName={'search'}
          color={colors.white}
          value={searchQuery}
          onChangeText={handleSearch} // Update search query on text change
        />
        {categories?.length === 0 && searchQuery ? (
          <View style={s.noDataContainer}>
            <TextView text={'Data not found'} type={'body-one'} color={colors.lightWhite} />
          </View>
        ) : (
          <View style={s.Categories}>
            {categories?.map((category, index) => (
              console.log(category, "category"),

              <TouchableOpacity
                key={category.id}
                style={s.CategoriesOption}
                // onPress={() => onPressCategories(category)}
              >
                <TextView
                  text={category?.name || ''}
                  type="body-one"
                  color={colors.lightWhite}
                />
              </TouchableOpacity>

            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  Categories: {
    marginTop: verticalScale(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  CategoriesOption: {
    width: '45%',
    padding: moderateScale(20),
    marginTop: verticalScale(10),
    marginHorizontal: scale(5),
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: borderRadius,
  },
  noDataContainer: {
    marginTop: verticalScale(20),
    alignItems: 'center',
  },
});

Categories.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,
    headerStyle: { elevation: 0 },
  });
};

export default Categories;