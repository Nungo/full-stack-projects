<template>
  <div class="dashboard-container">
    <h1>Welcome, {{ username }}!</h1>
    <p style="color: blue;">Welcome Chef Kota. This is your dashboard where you can manage your inventory. This includes adding and removing inventory.</p>

    <div class="inventory-management">
      <form @submit.prevent="addItem">
        <input v-model="newItem.name" placeholder="Item name" required />
        <input v-model.number="newItem.quantity" type="number" placeholder="Quantity" required />
        <button type="submit">Add Item</button>
      </form>

      <ul v-if="items.length > 0">
        <li v-for="item in items" :key="item.id">
          {{ item.name }} - Quantity: {{ item.quantity }}
          <button @click="editItem(item)">Edit</button>
          <button @click="deleteItem(item.id)">Delete</button>
        </li>
      </ul>
      <p v-else>No items in inventory. Add some items above!</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: 'Chef Kota', // Replace this with actual user data
      items: [],
      newItem: {
        name: '',
        quantity: 0,
      },
    };
  },
  mounted() {
    this.fetchItems();
  },
  methods: {
    async fetchItems() {
      try {
        const response = await axios.get('http://localhost:3000/api/dashboard-items'); // Use the existing API
        console.log('Fetched items:', response.data); // Log the fetched data
        this.items = response.data;
      } catch (error) {
        console.error('Error fetching items', error);
      }
    },
    async addItem() {
      try {
        const response = await axios.post('http://localhost:3000/api/dashboard-items', this.newItem);
        console.log('Added item:', response.data); // Log added item response
        this.items.push(response.data); // Ensure response.data has the structure { id, name, quantity }
        this.newItem.name = '';
        this.newItem.quantity = 0;
      } catch (error) {
        console.error('Error adding item', error);
      }
    },
    async editItem(item) {
      const updatedName = prompt('Enter new name:', item.name);
      const updatedQuantity = prompt('Enter new quantity:', item.quantity);

      if (updatedName && updatedQuantity !== null) {
        try {
          const response = await axios.put(`http://localhost:3000/api/dashboard-items/${item.id}`, {
            name: updatedName,
            quantity: updatedQuantity,
          });
          await this.fetchItems(); // Refresh the items list after editing
          console.log('Updated item:', response.data); // Log updated item response
          const index = this.items.findIndex(i => i.id === item.id);
          if (index !== -1) {
            this.$set(this.items, index, response.data); // Update item in the array
          }
        } catch (error) {
          console.error('Error editing item', error);
        }
      }
    },
    async deleteItem(id) {
      try {
        await axios.delete(`http://localhost:3000/api/dashboard-items/${id}`);
        console.log('Deleted item ID:', id); // Log deleted item ID
        this.items = this.items.filter(item => item.id !== id);
      } catch (error) {
        console.error('Error deleting item', error);
      }
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.inventory-management {
  margin-top: 20px;
}

form input {
  margin: 5px;
  padding: 10px;
  border: 1px solid #ddd;
}

button {
  margin: 5px;
  padding: 10px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>







  