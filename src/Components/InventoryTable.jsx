import React, { useState, useEffect } from "react";

const InventoryTable = () => {
    const [stockDetails, setStockDetails] = useState({
        stockName: "",
        category: "",
        quantity: ""
    });
    const [stockList, setStockList] = useState([]);
    const [sortAsc, setSortAsc] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const savedStockList = localStorage.getItem('stockList');
        if (savedStockList) {
            setStockList(JSON.parse(savedStockList));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('stockList', JSON.stringify(stockList));
    }, [stockList]);

    const handleAddStock = () => {
        if (!stockDetails.stockName || !stockDetails.category || !stockDetails.quantity) {
            alert("Please fill all the fields!");
            return;
        }
        if(stockDetails.quantity <= 0){
            alert("Quantity must be more than 0!");
            return;
        }

        setStockList((prevStockList) => [
            ...prevStockList,
            { ...stockDetails, id: Date.now(), quantity: parseInt(stockDetails.quantity) }
        ]);
        setStockDetails({
            stockName: "",
            category: "",
            quantity: 0
        });
    };

    const handleEdit = (id) => {
        const stockToEdit = stockList.find((stock) => stock.id === id);
        setStockDetails({ ...stockToEdit });
        handleDelete(id);
    }

    const handleDelete = (id) => {
        setStockList(stockList.filter((stock) => stock.id !== id));
    }

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const sortItems = () => {
        setSortAsc(!sortAsc);
        setStockList((prev) =>
            [...prev].sort((a, b) => (sortAsc ? a.quantity - b.quantity : b.quantity - a.quantity))
        );
    };

    const filteredStocks = stockList.filter((item) =>
        filter ? item.category.toLowerCase() === filter.toLowerCase() : true
    );

    return (
        <div className="bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-5xl border border-gray-700 mx-auto">
            {/* Header */}
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center text-gray-100">Inventory Management</h1>

            {/* Add New Item Form */}
            <div className="mb-6 sm:mb-8 bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-600">
                <h2 className="text-lg font-semibold mb-4 text-gray-200">Add New Stock</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Stock Name"
                        className="border border-gray-600 rounded-lg px-4 py-2 w-full sm:w-1/3 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setStockDetails({ ...stockDetails, stockName: e.target.value })}
                        value={stockDetails.stockName}
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        className="border border-gray-600 rounded-lg px-4 py-2 w-full sm:w-1/3 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setStockDetails({ ...stockDetails, category: e.target.value })}
                        value={stockDetails.category}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        className="border border-gray-600 rounded-lg px-4 py-2 w-full sm:w-1/3 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setStockDetails({ ...stockDetails, quantity: e.target.value })}
                        value={stockDetails.quantity}
                    />
                    <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer w-full sm:w-auto" onClick={handleAddStock}>
                        Add Stock
                    </button>
                </div>
            </div>

            {/* Filter and Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
                <select className="border border-gray-600 rounded-lg px-4 py-2 w-full sm:w-1/3 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" onChange={handleFilterChange} value={filter}>
                    <option value="">All Categories</option>
                    {Array.from(new Set(stockList.map((stock) => stock.category))).map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer w-full sm:w-auto" onClick={sortItems}>
                    Sort by Quantity ({sortAsc ? 'Ascending' : 'Descending'})
                </button>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-600">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="border border-gray-600 p-3 text-left text-gray-200">Stock Name</th>
                            <th className="border border-gray-600 p-3 text-left text-gray-200">Category</th>
                            <th className="border border-gray-600 p-3 text-left text-gray-200">Quantity</th>
                            <th className="border border-gray-600 p-3 text-center text-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredStocks.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="border border-gray-600 p-3 text-center text-gray-100">No stock available</td>
                                </tr>
                            )
                        }
                        {
                            filteredStocks.map((stock) => {
                                return (
                                    <tr className="bg-gray-700 hover:bg-gray-600" key={stock.id}>
                                        <td className="border border-gray-600 p-3 text-gray-100">{stock.stockName}</td>
                                        <td className="border border-gray-600 p-3 text-gray-100">{stock.category}</td>
                                        <td className={`border border-gray-600 p-3 text-gray-100 ${stock.quantity < 10 ? "text-red-400" : ""}`}>{stock.quantity}</td>
                                        <td className="border border-gray-600 p-3 text-center">
                                            <button className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition mx-1 cursor-pointer" onClick={() => handleEdit(stock.id)}>
                                                Edit
                                            </button>
                                            <button className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition mx-1 cursor-pointer" onClick={() => handleDelete(stock.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryTable;
