"use client"
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { fs } from '../firebaseConfig';
import React, { useEffect, useState } from 'react'

interface Table {
  tableNumber: number;
  status: string;
}

const Table = () => {
  const router = useRouter();
  const [tableOccupied, setTableOccupied] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);  // State to track selected table
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);  // State to manage overlay visibility

  useEffect(() => {
    const retrieveTableOccupied = async () => {
      const tablesCollection = collection(fs, "tables");
      const q = query(tablesCollection, where("status", "==", "occupied"));
      onSnapshot(q, (querySnapshot) => {
        const tables = querySnapshot.docs.map(doc => doc.data());
        setTableOccupied(tables as Table[]);
      });
    }

    retrieveTableOccupied();
  }, []);

  const handleTableClick = (tableNumber: number) => {
    if (!tableOccupied.some((table) => table.tableNumber === tableNumber)) {
      setSelectedTable(tableNumber);
      setIsOverlayVisible(true); // Show overlay when a table is selected
    }
  };

  const confirmSelection = () => {
    if (selectedTable !== null) {
      localStorage.setItem('tableNumber', selectedTable.toString());
      router.push("/category");
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-white overflow-scroll py-10 mx-auto container px-40">
      {/* Overlay when a table is selected */}
      {isOverlayVisible && selectedTable !== null && (
        <div className="flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">You selected Table {selectedTable}</h2>
            <button
              onClick={confirmSelection}
              className="bg-foreground text-white py-2 px-6 rounded-lg hover:bg-foreground/80"
            >
              Confirm Selection
            </button>
            <button
              onClick={() => setIsOverlayVisible(false)}  // Close overlay without saving
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Table Grid */}
      <div className="text-center">
        <h1 className="font-bold text-4xl text-black/70">Which table are <br /> you seated?</h1>
        <div className='grid grid-cols-5 gap-5 mt-16 text-2xl font-bold'>
          <button
            onClick={() => handleTableClick(0)}
            className="p-2 h-40 content-center rounded-xl bg-foreground/10 text-foreground hover:bg-foreground hover:text-white"
          >
            <p>Not seated</p>
          </button>
          {Array.from({ length: 25 }, (_, i) => (
            tableOccupied.some((table: Table) => table.tableNumber === i + 1) ? (
              <p key={i} className='p-2 rounded-xl bg-foreground text-white h-40 content-center cursor-not-allowed'>Occupied</p>
            ) : (
              <button
                key={i}
                onClick={() => handleTableClick(i + 1)}
                className="p-2 h-40 content-center rounded-xl bg-foreground/10 text-foreground hover:bg-foreground hover:text-white"
              >
                {i + 1}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  )
}

export default Table;
