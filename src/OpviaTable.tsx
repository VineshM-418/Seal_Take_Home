import React, { useState } from 'react';
import { Cell, Column, Table2 } from '@blueprintjs/table';
import { Dialog, Classes, Button } from '@blueprintjs/core';
import StatsDialog from './StatsDialog';

interface OpviaTableProps {
  columns: { columnName: string; columnType: string; columnId: string }[];
  dummyTableData: { [key: string]: number };
}

const OpviaTable: React.FC<OpviaTableProps> = ({ columns, dummyTableData }) => {
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aggregatedValues, setAggregatedValues] = useState<{
    min: number;
    max: number;
    avg: number;
  } | null>(null);

  const getSparseRefFromIndexes = (rowIndex: number, columnIndex: number): string =>
    `${columnIndex}-${rowIndex}`;
  
  const numRows = Math.max(
      ...Object.keys(dummyTableData)
        .map((key) => parseInt(key.split('-')[1], 10)) // Extract the row index from keys
        .filter((rowIndex) => !isNaN(rowIndex)) // Ensure it's a valid number
    ) + 1;

  const calculateAggregations = (columnIndex: number) => {
    const values: number[] = [];
    
    // Collect values from cells
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const sparsePosition = getSparseRefFromIndexes(rowIndex, columnIndex);
      
      if (dummyTableData[sparsePosition] !== undefined) {
        const value = dummyTableData[sparsePosition];
        const numericValue = parseFloat(value); // Convert to number
        
        if (!isNaN(numericValue)) {
          values.push(numericValue);
        }
      }
    }
  
    // Handle empty array case
    if (values.length === 0) {
      return { min: 0, max: 0, avg: 0 }; // No data, return default values
    }
  
    // Calculate average 
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;

    // Calculate min and max
    const min = Math.min(...values);
    const max = Math.max(...values);
  
    return { 
      min, 
      max, 
      avg  
    };
  };

  const handleColumnRightClick = (columnIndex: number) => (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default right-click menu from showing.
    const aggregations = calculateAggregations(columnIndex);
    setAggregatedValues(aggregations);
    setSelectedColumnIndex(columnIndex);
    setIsDialogOpen(true);
  };

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const sparsePosition = getSparseRefFromIndexes(rowIndex, columnIndex);
    const value =
      dummyTableData[sparsePosition] !== undefined ? dummyTableData[sparsePosition] : '';
    return <Cell>{String(value)}</Cell>;
  };

  const cols = columns.map((column, index) => (
    <Column
      key={`${column.columnId}`}
      cellRenderer={cellRenderer}
    
      columnHeaderCellRenderer={() => (
        <div
          style={{
            cursor: 'context-menu',
            padding: '0 10px', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
          }}
          onContextMenu={handleColumnRightClick(index)} 
        >
          {column.columnName}
        </div>
      )}
    />
  ));

  return (
    <div>
      
      <Table2 defaultRowHeight={35} numRows={95}>
        {cols}
      </Table2>
    
      <StatsDialog
         isOpen={isDialogOpen}
         onClose={() => setIsDialogOpen(false)}
         selectedColumnName={selectedColumnIndex !== null ? columns[selectedColumnIndex].columnName : undefined}
         aggregatedValues={aggregatedValues || undefined}
      />

    </div>
  );
};

export default OpviaTable;
