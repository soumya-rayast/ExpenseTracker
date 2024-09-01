import "./App.css";
import { IoIosCloseCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { publicRequest } from "./requestMethod";
import { FiDelete, FiEdit } from "react-icons/fi";

function App() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [updatedId, setUpdatedId] = useState("");
  const [updateLabel, setUpdatedLabel] = useState("");
  const [updateValue, setUpdatedValue] = useState(0);
  const [updateDate, setUpdatedDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [selectCategory, setSelectCategory] = useState('');
  const [categories, setCategories] = useState(['Food', 'Travel', 'Utilities', 'Entertainment', 'Others'])
  const [updateCategory, setUpdateCategory] = useState('')

  const handleAddExpense = () => setShowAddExpense(!showAddExpense);
  const handleShowReport = () => setShowReport(!showReport);
  const handleShowEdit = (id) => {
    setShowEdit(!showEdit);
    setUpdatedId(id);
  };

  const handleUpdateExpense = async () => {
    if (updatedId) {
      try {
        await publicRequest.put(`/expenses/${updatedId}`, {
          label: updateLabel,
          value: updateValue,
          date: updateDate,
          category: updateCategory
        });
        setExpenses((prevExpenses) =>
          prevExpenses.map((expense) =>
            expense._id === updatedId
              ? { ...expense, label: updateLabel, value: updateValue, date: updateDate }
              : expense
          )
        );
        setShowEdit(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleExpense = async () => {
    try {
      const res = await publicRequest.post('/expenses', {
        label,
        date,
        value: amount,
        category: selectCategory
      });
      setExpenses([...expenses, res.data]);
      setLabel("");
      setAmount(0);
      setDate("");
      setSelectCategory('')
      setShowAddExpense(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const res = await publicRequest.get("/expenses");
        setExpenses(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log(error);
        setExpenses([])
      }
    };
    getExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectCategory || expense.category === selectCategory)
  );
  const totalSum = filteredExpenses.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <>
      <div className="flex flex-col justify-center items-center mt-[3%] mr-[5%] ml-[5%] w-[90%]">
        <div className="relative flex flex-col sm:flex-row sm:flex-wrap items-center justify-between mt-5 w-full px-4">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <h1 className="text-3xl font-medium text-white">Expense Tracker</h1>
            <p className="text-lg sm:text-xl font-medium text-white">
              Expense Tracking Web Application
            </p>
          </div>
          <div className="relative flex flex-wrap gap-4 justify-center sm:justify-between w-full sm:w-auto">
            <button
              className="bg-green-500 text-white p-4 outline-none cursor-pointer hover:bg-green-400 border-none text-medium rounded-md"
              onClick={handleAddExpense}
            >
              Add Expenses
            </button>
            <button
              className="bg-blue-500 text-white p-4 outline-none cursor-pointer hover:bg-blue-400 border-none text-medium rounded-md"
              onClick={handleShowReport}
            >
              Expense Report
            </button>
            <button
              className="bg-yellow-500 text-white p-4 outline-none cursor-pointer hover:bg-yellow-400 border-none text-medium rounded-md"
              onClick={() => setShowCategories(!showCategories)}
            >
              Categories
            </button>
          </div>
          <div className="w-full sm:w-auto mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 w-full sm:w-64 border-2 border-[#20C997] rounded-md outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col">
          {filteredExpenses.map((expense) => (
            <div
              className="relative flex justify-between items-center w-[80vw] h-[80px] bg-[#20C997] my-[20px] py-[10px] rounded-lg"
              key={expense._id}
            >
              <h2 className="m-[20px] text-black text-[18px] font-medium">
                {expense.label}
              </h2>
              <span className="m-[20px] text-black text-[18px] font-medium">
                {expense.category}
              </span>
              <span className="m-[20px] text-black text-[18px] font-medium">
                {expense.date}
              </span>
              <span className="m-[20px] text-[18px] font-medium">
                ₹{expense.value}
              </span>
              <div className="m-[20px]">
                <FiDelete
                  className="text-red-500 font-bold mb-[5px] cursor-pointer text-[20px]"
                  onClick={() => handleDelete(expense._id)}
                />
                <FiEdit
                  className="text-white font-bold cursor-pointer text-[20px]"
                  onClick={() => handleShowEdit(expense._id)}
                />
              </div>
            </div>
          ))}
          {showAddExpense && (
            <div className="fixed inset-0 flex items-center justify-center z-[999] bg-black bg-opacity-50">
              <div className="flex flex-col p-[10px] h-[440px] w-[500px] bg-white shadow-xl rounded-lg">
                <div className="flex justify-end">
                  <IoIosCloseCircle
                    className="text-2xl text-red-500 cursor-pointer"
                    onClick={handleAddExpense}
                  />
                </div>
                <label className="mt-[10px] font-semibold text-[18px]">
                  Expense Name
                </label>
                <input
                  onChange={(e) => setLabel(e.target.value)}
                  type="text"
                  placeholder="Bike Rent"
                  className="border-[#6F42C1] outline-none border-2 p-[10px]"
                />
                <label className="mt-[10px] font-semibold text-[18px]">
                  Expense Date
                </label>
                <input
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="border-[#6F42C1] outline-none border-2 p-[10px]"
                />
                <label className="mt-[10px] font-semibold text-[18px]">
                  Expense Amount
                </label>
                <input
                  onChange={(e) => setAmount(e.target.value)}
                  type="text"
                  placeholder="80"
                  className="border-[#6F42C1] outline-none border-2 p-[10px]"
                />
                <label className="mt-[10px] font-semibold text-[18px]">
                  Category
                </label>
                <select
                  value={selectCategory}
                  onChange={(e) => setSelectCategory(e.target.value)}
                  className="border-[#6F42C1] outline-none border-2 p-[10px]"
                >
                  <option value='' disabled>
                    Select Category
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-green-500 text-white p-[10px] cursor-pointer my-[10px] rounded-md"
                  onClick={handleExpense}
                >
                  Add Expense
                </button>
              </div>
            </div>
          )}
          {showReport && (
            <div className="fixed inset-0 flex items-center justify-center z-[999] bg-black bg-opacity-50">
              <div className="flex flex-col p-[10px] h-[380px] w-[500px] bg-white shadow-xl rounded-lg">
                <div className="flex justify-end">
                  <IoIosCloseCircle
                    className="text-2xl text-red-500 cursor-pointer"
                    onClick={handleShowReport}
                  />
                </div>
                <div className="flex justify-center items-center flex-grow">
                  <PieChart
                    series={[
                      {
                        data: expenses.map((expense) => ({
                          label: expense.label,
                          value: expense.value,
                        })),
                        innerRadius: 30,
                        outerRadius: 100,
                        paddingAngle: 5,
                        cornerRadius: 5,
                        startAngle: -90,
                        endAngle: 180,
                      },
                    ]}
                  />
                </div>
                <div className="mt-4">
                  <strong>Total Expenses: </strong> ₹{totalSum}
                </div>
              </div>
            </div>
          )}
          {showCategories && (
            <div className="fixed inset-0 flex items-center justify-center z-[999] bg-black bg-opacity-50">
              <div className="flex flex-col p-[10px] h-[320px] w-[400px] bg-white shadow-xl rounded-lg">
                <div className="flex justify-end">
                  <IoIosCloseCircle
                    className="text-2xl text-red-500 cursor-pointer"
                    onClick={() => setShowCategories(false)}
                  />
                </div>
                <div className="flex flex-col">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className={`cursor-pointer p-[10px] ${selectCategory === category
                        ? 'border-[#6F42C1] bg-[#20C997] text-black'
                        : 'bg-white text-black'
                        } hover:bg-[#6F42C1] hover:text-white`}
                      onClick={() => {
                        setSelectCategory(category);
                        setShowCategories(false);
                      }}
                    >
                      {category}
                    </div>
                  ))}
                </div>
                <button
                  className="mt-2 p-[10px] bg-yellow-500 text-white rounded-md hover:bg-yellow-400"
                  onClick={() => {
                    setSelectCategory("");
                    setShowCategories(false);
                  }}
                >
                  Reset Filter
                </button>
              </div>
            </div>
          )}
          {showEdit && (
            <div className="fixed inset-0 flex items-center justify-center z-[999] bg-black bg-opacity-50">
              <div className="flex flex-col p-[10px] h-[450px] w-[500px] bg-white shadow-xl rounded-lg">
                <IoIosCloseCircle
                  className="flex justify-end text-2xl text-red-500 cursor-pointer"
                  onClick={() => setShowEdit(false)}
                />
                <label className="mt-[10px] font-semibold text-[18px]">
                  Expense Name
                </label>
                <input
                  value={updateLabel}
                  onChange={(e) => setUpdatedLabel(e.target.value)}
                  type="text"
                  className="border-[#6F42C1] outline-none border-2 p-[10px]"
                />
                <label className="mt-[10px] font-semibold text-[18px]">
                  Expense Date
                </label>
                <input
                  value={updateDate}
                  onChange={(e) => setUpdatedDate(e.target.value)}
                  type="date"
                  className="border-[#6F42C1] outline-none border-2 p-[10px]"
                />
                <label className="mt-[10px] font-semibold text-[18px]">
                  Expense Amount
                </label>
                <input
                  value={updateValue}
                  onChange={(e) => setUpdatedValue(e.target.value)}
                  type="text"
                  className="border-[#6F42C1] outline-none border-2 p-[10px]"
                />
                <label className="mt-[10px] font-semibold text-[18px]">
                  Expense Category
                </label>
                <select
                  value={updateCategory}
                  onChange={(e) => setUpdateCategory(e.target.value)}
                  className="border-[#6F42C1] outline-none border-2 p-[10px]"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-green-500 text-white p-[10px] cursor-pointer my-[10px] rounded-md"
                  onClick={handleUpdateExpense}
                >
                  Update Expense
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
