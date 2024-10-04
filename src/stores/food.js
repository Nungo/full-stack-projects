import { defineStore } from 'pinia';

export const useFoodStore = defineStore('food', {
  state: () => ({
    foodItems: []
  }),
  actions: {
    async fetchFoodItems() {
      const response = await fetch('/api/food-items');
      this.foodItems = await response.json();
    },
    async addFoodItem(item) {
      await fetch('/api/food-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      this.fetchFoodItems();
    },
    async updateFoodItem(id, item) {
      await fetch(`/api/food-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      this.fetchFoodItems();
    },
    async deleteFoodItem(id) {
      await fetch(`/api/food-items/${id}`, {
        method: 'DELETE'
      });
      this.fetchFoodItems();
    }
  }
});
