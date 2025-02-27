import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Hoặc một biểu tượng khác mà bạn chọn
import { MaterialIcons } from 'react-native-vector-icons'; // Thêm thư viện icon nếu cần
import RecipeWarehouse from '../customer/RecipeWarehouse';
import Searchs from "../customer/searchs";
import AddRecipe from "../customer/AddRecipe";
import RecipeDetail from "../customer/RecipeDetail";
import EditRecipe from "../customer/EditRecipe";
import InfoCustomer from "../customer/InfoCustomer";
import EditInfoCustomer from "../customer/EditInfoCustomer";
import SearchInHome from "../customer/SearchInHome";
import Screening from "../customer/Screening";
import shareCustomer from "../customer/shareCustomer";
import Comment from "../customer/Comment";
import Messenger from "../customer/Messenger";
import addToCollection from "../customer/addToCollection";
import RecentDishesScreen from "../customer/RecentDishesScreen";
import Stings from "../customer/Stings";
import Login from "../screens/Login";
import ForgotPassword from "../screens/ForgotPassword";
import messageDetail from "../customer/messageDetail";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tìm Kiếm" component={Searchs} options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="AddRecipe" 
        component={AddRecipe} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetail} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      
      <Stack.Screen 
        name="EditRecipe" 
        component={EditRecipe} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="InfoCustomer" 
        component={InfoCustomer} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="EditInfoCustomer" 
        component={EditInfoCustomer} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="SearchInHome" 
        component={SearchInHome} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="Screening" 
        component={Screening} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="shareCustomer" 
        component={shareCustomer} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="Comment" 
        component={Comment} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="addToCollection" 
        component={addToCollection} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="RecentDishesScreen" 
        component={RecentDishesScreen} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="Stings" 
        component={Stings} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPassword} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
    </Stack.Navigator>
  );
};

const WarehouseStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Kho món ngon của bạn" component={RecipeWarehouse} options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="AddRecipe" 
        component={AddRecipe} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetail} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      
      <Stack.Screen 
        name="EditRecipe" 
        component={EditRecipe} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="InfoCustomer" 
        component={InfoCustomer} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="EditInfoCustomer" 
        component={EditInfoCustomer} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="Comment" 
        component={Comment} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="addToCollection" 
        component={addToCollection} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="Stings" 
        component={Stings} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPassword} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
    </Stack.Navigator>
  );
};

const MessengerStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Đoạn chat" component={Messenger} options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetail} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="EditRecipe" 
        component={EditRecipe} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="InfoCustomer" 
        component={InfoCustomer} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="EditInfoCustomer" 
        component={EditInfoCustomer} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="shareCustomer" 
        component={shareCustomer} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="addToCollection" 
        component={addToCollection} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="RecentDishesScreen" 
        component={RecentDishesScreen} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="Stings" 
        component={Stings} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPassword} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
      <Stack.Screen 
        name="messageDetail" 
        component={messageDetail} 
        options={{ 
            headerLeft: null, // Ẩn nút mũi tên quay lại
            headerShown: false, // Ẩn tiêu đề và header
          }}
      />
    </Stack.Navigator>
  );
};

const Customer = () => {

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Trang chủ"
        options={{
          tabBarIcon: 'home',
        }}
      >
        {SearchStack}
      </Tab.Screen>

      <Tab.Screen
        name="Kho món ngon của bạn"
        options={{
          tabBarIcon: () => <Icon name="book" size={24} color="black" />,
        }}
      >
        {WarehouseStack}
      </Tab.Screen>

      <Tab.Screen
        name="Đoạn chat"
        options={{
          tabBarIcon: () => <Icon name="messenger" size={24} color="black" />,
        }}
      >
        {MessengerStack}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default Customer;
