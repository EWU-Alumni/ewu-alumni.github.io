<template src="./GoogleSheetDataWithFilterFixed.html">
</template>


<script setup>
import { onMounted, ref, computed, watch } from 'vue'

// Department enum mapping
const departments = {
  'CSE': 'Computer Science and Engineering',
  'EEE': 'Electrical and Electronic Engineering',
  'ECE': 'Electronics and Communications Engineering',
  'GEB': 'Genetic Engineering and Biotechnology',
  'CE': 'Civil Engineering',
  'PHARM': 'Pharmacy',
  'MPS': 'Mathematical and Physical Sciences',
  'BBA': 'Business Administration',
  'LAW': 'Law',
  'IS': 'Information Studies',
  'DS': 'Data Science',
  'ECO': 'Economics',
  'ENG': 'English',
  'SR': 'Social Relations',
  'SOC': 'Sociology'
};

// Configuration - Replace with your actual Google Sheet ID
const SHEET_ID = "1rP4OecQP5PCFuie9bzWb50fTGSvEF8nE7Dw5e8NveNY";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

// Reactive data
const loading = ref(true);
const error = ref(null);
const selectedDepartment = ref('');
const searchQuery = ref('');
const allData = ref([]);
const filteredData = ref([]);
const tableHeaders = ref([]);
const sortColumn = ref(null);
const sortDirection = ref('asc');
const currentPage = ref(1);
const itemsPerPage = ref(100);

// Computed properties
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value));

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

// Watchers
watch([selectedDepartment, searchQuery], () => {
  filterData();
  currentPage.value = 1;
});

// Methods
async function loadSheetData() {
  console.log("Loading sheet data...")
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    
    // Parse the JSON response (Google Sheets returns JSON wrapped in a callback)
    const jsonData = JSON.parse(text.substring(47).slice(0, -2));
    
    if (!jsonData.table || !jsonData.table.rows || jsonData.table.rows.length === 0) {
      error.value = "No data found in the spreadsheet";
      return;
    }

    // Extract headers
    tableHeaders.value = jsonData.table.cols.slice(1).map(col => col.label || '');

    // Process data
    allData.value = jsonData.table.rows.map(row => {
      return row.c.slice(1).map(cell => cell ? cell.v || '' : '');
    });

    filteredData.value = [...allData.value];
    
  } catch (err) {
    console.error('Error loading sheet data:', err);
    error.value = err.message || 'Failed to load data';
  } finally {
    loading.value = false;
  }
}

function filterData() {
  let data = [...allData.value];

  // Filter by department
  if (selectedDepartment.value) {
    const departmentName = departments[selectedDepartment.value];
    const departmentIndex = tableHeaders.value.findIndex(h => 
      h.toLowerCase().includes('department') || h.toLowerCase().includes('dept')
    );
    
    if (departmentIndex !== -1) {
      data = data.filter(row => 
        row[departmentIndex] && 
        row[departmentIndex].toString().toLowerCase().includes(departmentName.toLowerCase())
      );
    }
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    data = data.filter(row => 
      row.some(cell => 
        cell && cell.toString().toLowerCase().includes(query)
      )
    );
  }

  // Apply sorting
  if (sortColumn.value !== null) {
    data.sort((a, b) => {
      const aVal = a[sortColumn.value] || '';
      const bVal = b[sortColumn.value] || '';
      
      if (sortDirection.value === 'asc') {
        return aVal.toString().localeCompare(bVal.toString());
      } else {
        return bVal.toString().localeCompare(aVal.toString());
      }
    });
  }

  filteredData.value = data;
}

function performSearch() {
  filterData();
}

function clearSearch() {
  searchQuery.value = '';
  selectedDepartment.value = '';
  currentPage.value = 1;
}

function sortBy(columnIndex) {
  if (sortColumn.value === columnIndex) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = columnIndex;
    sortDirection.value = 'asc';
  }
  filterData();
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

onMounted(() => {
  loadSheetData();
})
</script>


<style scoped src="./GoogleSheetDataWithFilterFixed.css"></style>
