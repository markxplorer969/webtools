import React, { useState, useEffect, useRef } from 'react';
import { Copy, Download, Plus, Trash2, Save, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const TempNotes = () => {
  const [data, setData] = useState([
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ]);
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [isSaved, setIsSaved] = useState(false);
  const gridRef = useRef(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('tempNotes');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed.data || data);
        setRows(parsed.rows || rows);
        setCols(parsed.cols || cols);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('tempNotes', JSON.stringify({ data, rows, cols }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data, rows, cols]);

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Move to previous cell
        if (colIndex > 0) {
          const prevCell = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex - 1}"]`);
          prevCell?.focus();
        } else if (rowIndex > 0) {
          const prevCell = document.querySelector(`[data-row="${rowIndex - 1}"][data-col="${cols - 1}"]`);
          prevCell?.focus();
        }
      } else {
        // Move to next cell
        if (colIndex < cols - 1) {
          const nextCell = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex + 1}"]`);
          nextCell?.focus();
        } else if (rowIndex < rows - 1) {
          const nextCell = document.querySelector(`[data-row="${rowIndex + 1}"][data-col="0"]`);
          nextCell?.focus();
        }
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (rowIndex < rows - 1) {
        const nextRowCell = document.querySelector(`[data-row="${rowIndex + 1}"][data-col="${colIndex}"]`);
        nextRowCell?.focus();
      }
    }
  };

  const addRow = () => {
    const newRow = Array(cols).fill('');
    setData([...data, newRow]);
    setRows(rows + 1);
  };

  const addColumn = () => {
    const newData = data.map(row => [...row, '']);
    setData(newData);
    setCols(cols + 1);
  };

  const removeRow = (index) => {
    if (rows <= 1) return;
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
    setRows(rows - 1);
  };

  const removeColumn = (index) => {
    if (cols <= 1) return;
    const newData = data.map(row => row.filter((_, i) => i !== index));
    setData(newData);
    setCols(cols - 1);
  };

  const clearAll = () => {
    const newData = Array(rows).fill(null).map(() => Array(cols).fill(''));
    setData(newData);
  };

  const copyAll = async () => {
    const text = data.map(row => row.join('\t')).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      // Show success feedback
      const button = document.getElementById('copy-all-btn');
      if (button) {
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.innerHTML = '<Copy className="w-4 h-4 mr-2" />Copy All';
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Notes');
    
    // Generate filename with timestamp
    const filename = `temp_notes_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const exportToCSV = () => {
    const csv = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `temp_notes_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Temp Notes</h1>
              <p className="text-gray-600">Mini spreadsheet with auto-save and export options</p>
            </div>
            <div className="flex items-center gap-2">
              {isSaved && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <Save className="w-4 h-4" />
                  Saved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-3">
            {/* Add/Remove Controls */}
            <div className="flex gap-2">
              <button
                onClick={addRow}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </button>
              <button
                onClick={addColumn}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Column
              </button>
            </div>

            {/* Export Controls */}
            <div className="flex gap-2">
              <button
                onClick={copyAll}
                id="copy-all-btn"
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                Copy All
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {/* Clear Controls */}
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>

          {/* Grid Info */}
          <div className="mt-4 text-sm text-gray-600">
            Grid Size: {rows} × {cols} | Auto-saved to browser storage
          </div>
        </div>

        {/* Spreadsheet Grid */}
        <div className="p-6 overflow-auto">
          <div className="inline-block min-w-full">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="border-collapse" ref={gridRef}>
                <thead>
                  <tr>
                    <th className="w-12 h-8 bg-gray-50 border border-gray-300 text-xs font-medium text-gray-500">
                      #
                    </th>
                    {Array.from({ length: cols }, (_, i) => (
                      <th key={i} className="w-32 h-8 bg-gray-50 border border-gray-300 text-xs font-medium text-gray-500 relative group">
                        {String.fromCharCode(65 + i)}
                        <button
                          onClick={() => removeColumn(i)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                          title="Remove column"
                        >
                          ×
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="w-12 h-10 bg-gray-50 border border-gray-300 text-xs font-medium text-gray-500 relative group">
                        {rowIndex + 1}
                        <button
                          onClick={() => removeRow(rowIndex)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                          title="Remove row"
                        >
                          ×
                        </button>
                      </td>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} className="border border-gray-300 p-0">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                            data-row={rowIndex}
                            data-col={colIndex}
                            className="w-full h-10 px-2 border-none outline-none focus:bg-blue-50 text-sm"
                            placeholder="..."
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">Instructions:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use Tab to navigate between cells</li>
            <li>• Use Enter to move to the next row</li>
            <li>• Click × to remove rows/columns</li>
            <li>• Data auto-saves to browser storage</li>
            <li>• Export to Excel or CSV for backup</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TempNotes;