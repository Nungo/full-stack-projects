<template>
  <div class="inventory">
    <h2>Inventory Management</h2>
    <form @submit.prevent="addItem">
      <input v-model="itemName" placeholder="Item Name" required />
      <input v-model.number="itemQuantity" type="number" placeholder="Quantity" required min="1" />
      <button type="submit">Add Item</button>
    </form>

    <h3>Inventory List</h3>
    <ul>
      <li v-for="(item, index) in inventory" :key="item.id">
        {{ item.name }} - Quantity: {{ item.quantity }}
        <button @click="subtractItem(item)">Remove</button>
        <button @click="editItem(item)">Edit</button>
        <button @click="deleteItem(item)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemName: '',
      itemQuantity: 0,
      inventory: [], // Initialize with an empty array, will fetch from the backend
    };
  },
  methods: {
    async fetchInventory() {
      try {
        const response = await fetch('http://localhost:3000/api/inventory');
        if (response.ok) {
          const data = await response.json();
          this.inventory = data;
        } else {
          console.error('Failed to fetch inventory.');
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    },
    async addItem() {
      if (this.itemName && this.itemQuantity > 0) {
        const newItem = {
          name: this.itemName,
          quantity: this.itemQuantity,
        };

        try {
          const response = await fetch('http://localhost:3000/api/inventory', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
          });
          if (response.ok) {
            this.fetchInventory(); // Refresh the list after adding
            this.itemName = '';
            this.itemQuantity = 0;
          } else {
            console.error('Failed to add item.');
          }
        } catch (error) {
          console.error('Error adding item:', error);
        }
      }
    },
    async subtractItem(item) {
      if (item.quantity > 1) {
        const updatedItem = { ...item, quantity: item.quantity - 1 };

        try {
          const response = await fetch(`http://localhost:3000/api/inventory/${item.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
          });
          if (response.ok) {
            this.fetchInventory(); // Refresh the list after updating
          } else {
            console.error('Failed to subtract item.');
          }
        } catch (error) {
          console.error('Error subtracting item:', error);
        }
      } else {
        this.deleteItem(item); // Delete if quantity goes to 0
      }
    },
    async editItem(item) {
      const newName = prompt('Enter a new name:', item.name);
      if (newName !== null && newName !== '') {
        const updatedItem = { ...item, name: newName };

        try {
          const response = await fetch(`http://localhost:3000/api/inventory/${item.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
          });
          if (response.ok) {
            this.fetchInventory(); // Refresh the list after editing
          } else {
            console.error('Failed to edit item.');
          }
        } catch (error) {
          console.error('Error editing item:', error);
        }
      }
    },
    async deleteItem(item) {
      try {
        const response = await fetch(`http://localhost:3000/api/inventory/${item.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.fetchInventory(); // Refresh the list after deleting
        } else {
          console.error('Failed to delete item.');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },
  },
  mounted() {
    this.fetchInventory(); // Fetch the inventory when the component is mounted
  },
};
</script>

<style scoped>
.inventory {
  margin: 2rem 0;
}

.inventory form {
  margin-bottom: 1rem;
}

.inventory input {
  margin-right: 1rem;
}

button {
  margin-right: 0.5rem;
}
</style>


  