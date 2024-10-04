<template>
    <div>
      <h1>Food Inventory</h1>
      <ul>
        <li v-for="item in foodItems" :key="item.id">{{ item.name }} - {{ item.quantity }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const foodItems = ref([]);
  
      const fetchFoodItems = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/food-items');
          foodItems.value = response.data;
        } catch (error) {
          console.error('Error fetching food items:', error);
        }
      };
  
      onMounted(() => {
        fetchFoodItems();
      });
  
      return {
        foodItems
      };
    }
  }
  </script>
  