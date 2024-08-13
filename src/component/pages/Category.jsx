import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { API_URL, LIVE_URL } from '../config';
import { toast, ToastContainer } from 'react-toastify';

export default function Category({ vCatId: _id }) {
    const [Category, setCategory] = useState([]);
    const [categoryData, setCategoryData] = useState({
        vName: '',
        vStartColor: '#000000', // Default color value
        vEndColor: '#000000',   // Default color value
        vIcon: null,
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [preview, setPreview] = useState(null);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.post(`${LIVE_URL}category/list`).then(response => {
            console.log("category data ===>", response.data.data);
            setCategory(response.data.data);
        }).catch(error => {
            console.log(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('vName', categoryData.vName);
        formData.append('vStartColor', categoryData.vStartColor);
        formData.append('vEndColor', categoryData.vEndColor);
        formData.append('vIcon', categoryData.vIcon);

        const updateData = new FormData();
        updateData.append('vName', categoryData.vName);
        // updateData.append('vIcon', categoryData.vIcon);

        try {
            if (isUpdating) {
                updateData.append('vCatId', currentCategoryId); // Append the currentCategoryId to FormData
                await axios.put(`${LIVE_URL}category/details`, updateData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success('Category Updated successfully!');
            } else {
                await axios.post(`${LIVE_URL}category/details`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }

                });
                toast.success('Category created successfully!');
            }
            fetchData();
            setCategoryData({
                vName: '',
                vStartColor: '#000000', // Reset to default color value
                vEndColor: '#000000',   // Reset to default color value
                vIcon: null,
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setIsUpdating(false);
            setCurrentCategoryId(null);
            setPreview(null); // Reset the preview
        } catch (error) {
            console.log(error.response ? error.response.data : error.message);
        }
    };

    const handleDelete = () => {
        axios.delete(`${LIVE_URL}category/details`, {
            data: { vCatId: deleteCategoryId },
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log("Category deleted successfully:", response.data);
                fetchData();
                setDeleteCategoryId(null);
            })
            .catch(error => {
                console.error("Error deleting category:", error.response ? error.response.data : error.message);
            });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCategoryData({ ...categoryData, vIcon: file });
        setPreview(URL.createObjectURL(file)); // Set the preview URL
    };

    const handleUpdate = (category) => {
        setCategoryData({
            vName: category.vName,
            // vStartColor: category.vStartColor,
            // vEndColor: category.vEndColor,
            // vIcon: null, // We can't set the file input value
        });
        setPreview(`http://143.244.139.153:5000/${category.vIcon}`);
        setIsUpdating(true);
        setCurrentCategoryId(category._id);
    };

    return (
        <div>
            <div className="px-2">
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    transition:Bounce
                />

                <form onSubmit={handleSubmit} className="category-form d-flex justify-content-center mt-5">
                    <div className='row border p-3'>
                        <div className='col-lg-12 mb-3'>
                            <label htmlFor="category" className="form-label">Category Name</label>
                            <input
                                type="text"
                                className='form-control py-2 px-2'
                                id='category'
                                value={categoryData.vName}
                                onChange={(e) => setCategoryData({ ...categoryData, vName: e.target.value })}
                                required
                            />
                        </div>
                        <div className='col-lg-2 mb-3 mx-2'>
                            <label htmlFor="startcolor" className="form-label">Start Color</label>
                            <input
                                type="color"
                                className='form-control rounded'
                                id='startcolor'
                                value={categoryData.vStartColor}
                                onChange={(e) => setCategoryData({ ...categoryData, vStartColor: e.target.value })}
                                required
                            />
                        </div>
                        <div className='col-lg-2 mb-3 mx-2'>
                            <label htmlFor="endcolor" className="form-label">End Color</label>
                            <input
                                type="color"
                                className='form-control'
                                id='endcolor'
                                value={categoryData.vEndColor}
                                onChange={(e) => setCategoryData({ ...categoryData, vEndColor: e.target.value })}
                                required
                            />
                        </div>
                        <div className='col-lg-12 mb-3'>
                            <label htmlFor="file" className="form-label">Upload Image</label><br></br>
                            <input
                                type="file"
                                name="file"
                                className='form-control-file px-2 py-2 border w-100 rounded'
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                required={!isUpdating}
                            />
                            {preview && <img src={preview} alt="Preview" className='img-fluid mt-2 category-select-icon' />}
                        </div>
                        <div className='col-lg-12 mb-3'>
                            <button type='submit' className='btn btn-primary text-center px-2 py-2 d-flex m-auto' data-bs-dismiss="modal">
                                {isUpdating ? 'Update Category' : 'Add Category'}
                            </button>
                        </div>
                    </div>
                </form>

                <div className='container mx-auto my-5 table-height table-responsive'>
                    <div className='row'>
                        <div className='col-12'>
                            <table className="table table-border category-table">
                                <thead>
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">Icon</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Start Color</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Category.map((item, id) => (
                                        <tr key={item._id}>
                                            <td>{id + 1}</td>
                                            <td>
                                                <img crossOrigin="anonymous" src={`http://143.244.139.153:5000/${item.vIcon}`} alt={item.vName} className='img-fluid category-icon' />
                                            </td>
                                            <td>{item.vName}</td>
                                            <td>
                                                <input type="color" value={item.vStartColor} className='mx-2' readOnly />
                                                <input type="color" value={item.vEndColor} className='mx-2' readOnly />
                                            </td>
                                            <td>
                                                <button
                                                    className='btn btn-danger mx-2 p-2'
                                                    onClick={() => setDeleteCategoryId(item._id)}
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#deleteModal"
                                                >
                                                    Delete
                                                </button>
                                                <button className='btn btn-success mx-2 p-2' onClick={() => handleUpdate(item)}>Update</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog d-flex m-auto modal-dialog-centered">
                    <div className="modal-content ">
                        <div className="modal-header justify-content-between px-3 py-3">
                            <h5 className="modal-title" id="deleteModalLabel">Delete Category</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body px-3 py-3">
                            Are you sure you want to delete this category?
                        </div>
                        <div className="modal-footer px-3 py-3">
                            <button type="button" className="btn btn-secondary p-2 mx-2" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger p-2 mx-2" data-bs-dismiss="modal" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
