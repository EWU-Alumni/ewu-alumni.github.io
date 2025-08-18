<template>
  <div id="sheet-container">
    <button id="reload-btn" @click="loadSheetData">Reload Data</button>
    <div id="sheet-data">Loading...</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// Configuration - Replace with your actual Google Sheet ID
const SHEET_ID = "1rP4OecQP5PCFuie9bzWb50fTGSvEF8nE7Dw5e8NveNY"; // Demo sheet ID
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

const sheetDataRef = ref(null);

async function loadSheetData() {
  console.log("Loading sheet data...")
  
  // Use the ref instead of getElementById
  const container = sheetDataRef.value;
  
  // Check if container exists before proceeding
  if (!container) {
    console.error('Container element not found');
    return;
  }

  try {
    container.innerHTML = '<div class="loading">Loading data from Google Sheets...</div>';
    
    const targetUrl = encodeURIComponent(SHEET_URL)
    const proxyUrl = `https://api.allorigins.win/raw?url=${targetUrl}`

    const response = await fetch(SHEET_URL);
    const text = await response.text();

    // Parse the JSON response (Google Sheets returns JSON wrapped in a callback)
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;
    console.log(json);
    console.log(rows);
    if (!rows || rows.length === 0) {
      console.log("No data found in the spreadsheet")
      container.innerHTML = '<div class="error">No data found in the spreadsheet.</div>';
      return;
    }

    // Build HTML table
    let html = '<table class="sheet-table">';

    // Add table headers from JSON labels (skip first column)
    const labels = json.table.cols;
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
    
    // Use all rows as data (don't skip first row since we're using labels)
    rows.forEach(row => {
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

onMounted(() => {
  // Set the ref to the actual DOM element
  sheetDataRef.value = document.getElementById('sheet-data');
  loadSheetData();
})
</script>

<style>
  #sheet-container {
    margin: 2rem 0;
  }

  #reload-btn {
    margin-bottom: 15px;
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
</style>
