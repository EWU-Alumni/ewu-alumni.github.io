<template>
  <div id="sheet-container">
    <div class="controls">
      <button id="reload-btn" @click="loadSheetData">Reload Data</button>
      <select id="department-filter" v-model="selectedDepartment" @change="filterData">
        <option value="">All Departments</option>
        <option v-for="(label, code) in departments" :key="code" :value="code">
          {{ label }}
        </option>
      </select>
    </div>
    <div id="sheet-data">Loading...</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

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
const SHEET_ID = "1rP4OecQP5PCFuie9bzWb50fTGSvEF8nE7Dw5e8NveNY"; // Demo sheet ID
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

const sheetDataRef = ref(null);
const selectedDepartment = ref('');
const allData = ref([]);
let jsonData = null;

async function loadSheetData() {
  console.log("Loading sheet data...")
  
  const container = sheetDataRef.value;
  
  if (!container) {
    console.error('Container element not found');
    return;
  }

  try {
    container.innerHTML = '<div class="loading">Loading data from Google Sheets...</div>';
    
    const response = await fetch(SHEET_URL);
    const text = await response.text();

    // Parse the JSON response (Google Sheets returns JSON wrapped in a callback)
    jsonData = JSON.parse(text.substring(47).slice(0, -2));
    const rows = jsonData.table.rows;
    
    if (!rows || rows.length === 0) {
      console.log("No data found in the spreadsheet")
      container.innerHTML = '<div class="error">No data found in the spreadsheet.</div>';
      return;
    }

    // Store all data for filtering
    allData.value = rows;
    filterData();

  } catch (error) {
    console.error('Error loading sheet data:', error);
    if (container) {
      container.innerHTML = `
        <div class="error">
          <strong>Error loading data:</strong><br>
          ${error.message}<br>
          <small>Please check if the Google Sheet ID is correct and the sheet is publicly accessible.</small>
        </div>
      `;
    }
  }
}

function filterData() {
  const container = sheetDataRef.value;
  if (!container || !allData.value.length) return;

  let dataToShow = allData.value;

  // Filter by department if selected
  if (selectedDepartment.value) {
    const departmentName = departments[selectedDepartment.value];
    dataToShow = allData.value.filter(row => {
      // Check all columns for department match
      return row.c.some(cell => 
        cell && cell.v && 
        cell.v.toString().toLowerCase().includes(departmentName.toLowerCase())
      );
    });
  }

  displayData(dataToShow);
}

function displayData(data) {
  const container = sheetDataRef.value;
  if (!container) return;

  if (data.length === 0) {
    container.innerHTML = '<div class="error">No data found for the selected department.</div>';
    return;
  }

  // Build HTML table
  let html = '<table class="sheet-table">';

  // Add table headers from JSON labels (skip first column)
  const labels = jsonData.table.cols;
  if (labels && labels.length > 0) {
    html += '<thead><tr>';
    // Skip first column (index 0) and use labels from index 1 onwards
    labels.slice(1).forEach(label => {
      const value = label ? (label.label || '') : '';
      html += `<th>${value}</th>`;
    });
    html += '</tr></thead>';
  }

  // Add table body
  html += '<tbody>';
  
  data.forEach(row => {
    html += '<tr>';
    // Skip first column (index 0) and start from index 1
    if (row.c && row.c.length > 1) {
      row.c.slice(1).forEach(cell => {
        const value = cell ? (cell.v || '') : '';
        html += `<td>${value}</td>`;
      });
    }
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

onMounted(() => {
  sheetDataRef.value = document.getElementById('sheet-data');
  loadSheetData();
})
</script>

<style>
  #sheet-container {
    margin: 2rem 0;
  }

  .controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  #reload-btn {
    padding: 8px 16px;
    border: 1px solid #0b8059;
    border-radius: 4px;
    background: #0b8059;
    color: white;
    cursor: pointer;
    font-size: 14px;
  }

  #reload-btn:hover {
    background: #047857;
  }

  #department-filter {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    min-width: 250px;
  }

  .sheet-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  .sheet-table th,
  .sheet-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }

  .sheet-table th {
    background-color: #f8f9fa;
    font-weight: 600;
  }

  .sheet-table tr:nth-child(even) {
    background-color: #f8f9fa;
  }

  .loading {
    padding: 20px;
    text-align: center;
    color: #666;
  }

  .error {
    padding: 20px;
    text-align: center;
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    .controls {
      flex-direction: column;
      align-items: stretch;
    }
    
    #department-filter {
      min-width: auto;
    }
  }
</style>
</template>
