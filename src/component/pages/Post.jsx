import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { API_URL } from '../config';

export default function Post({ vTemplateId: _id }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postData, setPostData] = useState({
        vThumbImage: '',
        vOriginalImage: '',
        isTrending: false,
        isPremium: false,
        vDiscription: '', // Single string for JSON-like input
        vCatId: '',
    });
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    useEffect(() => {
        loadOptions();
    }, []);

    const fetchData = async (vCatId) => {
        try {
            const response = await axios.post(`${API_URL}template/frameBycatId`, { vCatId });
            console.log("Post fetch Data ===>", response.data.data);
            setPosts(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCategorySelect = (selectedOption) => {
        console.log("Selected Category:", selectedOption);
        setSelectedCategory(selectedOption);
        setPostData(prevState => ({
            ...prevState,
            vCatId: selectedOption ? selectedOption.id : ''
        }));
        if (selectedOption) {
            fetchData(selectedOption.id);
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setPostData(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPostData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const base64 = await fileToBase64(file);

        setPostData(prevState => ({
            ...prevState,
            [e.target.name]: base64
        }));
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const [options, setOptions] = useState([]);
    const loadOptions = async () => {
        try {
            const response = await axios.post(`${API_URL}category/list`);
            const data = response.data.data.map(category => ({
                label: category.vName,
                value: category._id, // Use _id as the value
                id: category._id
            }));
            console.log(data);

            setOptions(data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!postData.vCatId) {
            alert('Category is required. Please select a category.');
            return;
        }

        let vDiscription;
        try {
            vDiscription = JSON.parse(postData.vDiscription);
            if (!Array.isArray(vDiscription)) {
                throw new Error('vDiscription should be an array');
            }
        } catch (error) {
            console.error('Invalid JSON format for vDiscription:', error.message);
            alert('Invalid JSON format for vDiscription. Please correct it and try again.');
            return;
        }

        const data = {
            vThumbImage: postData.vThumbImage,
            vOriginalImage: postData.vOriginalImage,
            isTrending: postData.isTrending,
            isPremium: postData.isPremium,
            vDiscription: vDiscription, // Send as an array
            vCatId: postData.vCatId,
        };

        try {
            const response = await axios.post(`${API_URL}template/details`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Post Save Data ===>', response.data);
            setPostData({
                vThumbImage: '',
                vOriginalImage: '',
                isTrending: false,
                isPremium: false,
                vDiscription: '',
                vCatId: '',
            });
            setSelectedCategory(null); // Reset category select
            fetchData(postData.vCatId);
        } catch (error) {
            console.error('Error submitting data:', error.response ? error.response.data : error.message);
        }
    };

    // const handleDelete = async (_id) => {
    //     try {
    //         await axios.delete(`${API_URL}template/details`, { vTemplateId });
    //         setPosts(posts.filter(post => post._id !== id));
    //     } catch (error) {
    //         console.error('Error deleting data:', error);
    //     }
    // };
    const handleDelete = () => {
        axios.delete(`${API_URL}template/details`, {
            data: { vTemplateId: deleteCategoryId },
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

    const handleUpdateClick = (post) => {
        setPostData({
            vThumbImage: post.vThumbImage,
            vOriginalImage: post.vOriginalImage,
            isTrending: post.isTrending,
            isPremium: post.isPremium,
            vDiscription: JSON.stringify(post.vDiscription, null, 2), // Convert back to string
            vCatId: post.vCatId,
        });
        setSelectedCategory(options.find(option => option.id === post.vCatId));
    };

    return (
        <div>
            <div className='container mx-auto mt-5'>
                <form onSubmit={handleSubmit}>
                    <div className='row border px-3 py-3'>
                        <div className='col-lg-12'>
                            <label htmlFor="inputState" className="form-label">Category</label>
                            <Select
                                name='vehicletype'
                                id='vehicletype01'
                                className='master-popup-input px-2'
                                value={selectedCategory}
                                onChange={handleCategorySelect}
                                onMenuOpen={loadOptions}
                                options={options}
                            ></Select>
                        </div>
                        <div className='col-lg-6 pe-2 py-2'>
                            <label htmlFor="vThumbImage">Thumb Image</label>
                            <input
                                type="file"
                                className='form-control py-2'
                                name="vThumbImage"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className='col-lg-6 ps-2 py-2'>
                            <label htmlFor="vOriginalImage">Original Image</label>
                            <input
                                type="file"
                                className='form-control py-2'
                                name="vOriginalImage"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className='col-lg-3 me-2'>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isTrending"
                                        checked={postData.isTrending}
                                        onChange={handleCheckboxChange}
                                    />
                                    Trending
                                </label>
                            </div>
                        </div>
                        <div className='col-lg-3 ms-2'>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isPremium"
                                        checked={postData.isPremium}
                                        onChange={handleCheckboxChange}
                                    />
                                    Premium
                                </label>
                            </div>
                        </div>
                        <div className='col-lg-12'>
                            <label htmlFor="vDiscription">Description</label>
                            <textarea
                                className='form-control px-2'
                                name="vDiscription"
                                value={postData.vDiscription}
                                onChange={handleInputChange}
                                placeholder={`[\n  {\n    "Text": "",\n    "Textsize": "",\n    "Textcolor": "",\n    "Xpos": "",\n    "Ypos": "",\n    "Font": "",\n    "LineHeight": "",\n    "LetterSpacing": ""\n  }\n]`}
                            />
                        </div>
                        <div className='col-lg-12 mt-3'>
                            <div className='text-center'>
                                <button type='submit' className='btn btn-success p-2'>Upload Post</button>
                            </div>
                        </div>
                    </div>
                </form>

                <div className='mt-5 table-responsive'>
                    <table className="table table-border category-table">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Category</th>
                                <th scope="col">Trending Or Premium</th>
                                <th scope="col">Description</th>
                                <th>Delete / Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{options.find(option => option.id === item.vCatId)?.label || 'Unknown'}</td>
                                    <td>
                                        {item.isTrending ? 'Trending' : ''}
                                        {item.isPremium ? ' Premium' : ''}
                                    </td>
                                    <td className='text-start'><pre>{JSON.stringify(item.vDiscription, null, 2)}</pre></td>
                                    <td>
                                        <button className='btn btn-danger mx-2 p-2' onClick={() => handleDelete(item._id)}>Delete</button>
                                        <button className='btn btn-success mx-2 p-2' onClick={() => handleUpdateClick(item)}>Update</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
