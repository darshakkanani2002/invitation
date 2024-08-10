import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { API_URL, LIVE_URL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Post({ vTemplateId: _id }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postData, setPostData] = useState({
        _id: '',
        vThumbImage: '',
        vOriginalImage: '',
        isTrending: false,
        isPremium: false,
        vDiscription: '',
        vCatId: '',
    });
    const [options, setOptions] = useState([]);
    const fileInputRef1 = useRef(null);
    const fileInputRef = useRef(null);
    // const [thumbImage, setThumbImage] = useState(null);
    // const [originalImage, setOriginalImage] = useState(null);
    // const [uploadedImages, setUploadedImages] = useState(null);

    useEffect(() => {
        loadOptions();
    }, []);

    const fetchData = async (vCatId, page = 1, limit = 10) => {
        try {
            const response = await axios.post(`${LIVE_URL}template/frameBycatId`, { iPage: page, iLimit: limit, vCatId });
            setPosts(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadOptions = async () => {
        try {
            const response = await axios.post(`${LIVE_URL}category/list`);
            const data = response.data.data.map(category => ({
                label: category.vName,
                value: category._id,
                id: category._id
            }));
            setOptions(data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const handleCategorySelect = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setPostData(prevState => ({
            ...prevState,
            vCatId: selectedOption ? selectedOption.id : ''
        }));
        if (selectedOption) {
            fetchData(selectedOption.id);
            console.log("Selected Options ===>", selectedOption);

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
        if (!file) return;

        const formData = new FormData();
        formData.append(e.target.name, file);

        try {
            const res = await axios.post(`${LIVE_URL}addImage/details`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            // Assuming the API returns the paths of the uploaded images
            if (e.target.name === "vThumbImage") {
                setPostData(prevState => ({
                    ...prevState,
                    vThumbImage: res.data.data.thumbImage
                }));
            } else if (e.target.name === "vOriginalImage") {
                setPostData(prevState => ({
                    ...prevState,
                    vOriginalImage: res.data.data.originalImage
                }));
            }
            console.log("Uploaded Data ===>", res.data.data);
        } catch (err) {
            console.error("Error uploading images:", err);
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
            vDiscription: vDiscription,
        };

        try {
            let response;
            if (postData._id) {
                // Update existing post, exclude isPremium
                const updateData = { ...data, vTemplateId: postData._id };
                response = await axios.put(`${LIVE_URL}template/details`, updateData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                toast.success('Post updated successfully!');
            } else {
                // Create new post, include isPremium
                data.isPremium = postData.isPremium; // Add isPremium for new post
                data.vCatId = postData.vCatId
                response = await axios.post(`${LIVE_URL}template/details`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                toast.success('Post created successfully!');
            }

            // Log the response data in the console
            console.log("Post Save Data ===>", response.data);

            // Reset form data
            setPostData({
                _id: '',
                vThumbImage: null,
                vOriginalImage: null,
                isTrending: false,
                isPremium: false,
                vDiscription: '',
                vCatId: '',
            });
            if (fileInputRef.current || fileInputRef1.current) {
                fileInputRef.current.value = '';
                fileInputRef1.current.value = '';
            }

            // Fetch the updated data
            fetchData(postData.vCatId);
        } catch (error) {
            console.error('Error submitting data:', error.response ? error.response.data : error.message);
        }
    };


    const refresh = () => {
        if (selectedCategory) {
            fetchData(selectedCategory.id);
        }
    };

    const handleDelete = async (id) => {
        let response;
        const vTemplateId = id.toString();
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");
        if (!isConfirmed) {
            return;
        }

        try {
            response = await axios.delete(`${LIVE_URL}template/details`, {
                data: { vTemplateId },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Deleted Post Data ===>", response.data);

            toast.success('Post deleted successfully!');
            refresh();
        } catch (error) {
            toast.error('Error deleting post.');
            console.log("Error deleting post:", error);
        }
    };

    const handleUpdateClick = (post) => {
        setPostData({
            _id: post._id,
            vThumbImage: post.vThumbImage,
            vOriginalImage: post.vOriginalImage,
            isTrending: post.isTrending,
            isPremium: post.isPremium,
            vDiscription: JSON.stringify(post.vDiscription, null, 2),
            vCatId: post.vCatId,
        });
        setSelectedCategory(options.find(option => option.id === post.vCatId));
    };

    return (
        <div>
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
                            />
                        </div>
                        <div className='col-lg-6 pe-2 py-2 mb-3'>
                            <label htmlFor="vThumbImage">Thumb Image</label>
                            <input
                                type="file"
                                className='form-control py-2'
                                name="vThumbImage"
                                onChange={handleFileChange}
                                ref={fileInputRef1}
                            />
                            {postData.vThumbImage && (
                                <img crossOrigin="anonymous" src={`http://143.244.139.153:5000/${postData.vThumbImage}`} alt="Thumb Preview" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
                            )}
                        </div>
                        <div className='col-lg-6 ps-2 py-2 mb-3'>
                            <label htmlFor="vOriginalImage">Original Image</label>
                            <input
                                type="file"
                                className='form-control py-2'
                                name="vOriginalImage"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            {postData.vOriginalImage && (
                                <img crossOrigin="anonymous" src={`http://143.244.139.153:5000/${postData.vOriginalImage}`} alt="Original Preview" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
                            )}
                        </div>
                        <div className='col-lg-3 me-2'>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isTrending"
                                        className='post-input-checkbox'
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
                                        className='post-input-checkbox'
                                        checked={postData.isPremium}
                                        onChange={handleCheckboxChange}
                                    />
                                    Premium
                                </label>
                            </div>
                        </div>
                        <div className='col-lg-10 mt-3'>
                            <label htmlFor="vDiscription">Description</label>
                            <textarea
                                className='form-control px-2 post-description'
                                name="vDiscription"
                                value={postData.vDiscription}
                                onChange={handleInputChange}
                                placeholder={`[\n  {\n    "Text": "",\n    "Textsize": "",\n    "Textcolor": "",\n    "Xpos": "",\n    "Ypos": "",\n    "Font": "",\n    "LineHeight": "",\n    "LetterSpacing": ""\n  }\n]`}
                            />
                        </div>
                        <div className='col-lg-12 mt-3'>
                            <div className='text-center'>
                                <button type='submit' className='btn btn-success p-2'>{postData._id ? 'Update Post' : 'Upload Post'}</button>
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
                                <th scope="col">Thumb Image</th>
                                <th scope="col">Original Image</th>
                                <th>Delete / Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{options.find(option => option.id === item.vCatId)?.label || 'Unknown'}</td>
                                    <td>
                                        {item.isTrending && 'Trending'}
                                        {item.isTrending && item.isPremium && ' / '}
                                        {item.isPremium && 'Premium'}
                                    </td>
                                    <td className='text-start'><pre className='post-vdescription-data'>{JSON.stringify(item.vDiscription, null, 2)}</pre></td>
                                    <td>
                                        {item.vThumbImage && <img crossOrigin="anonymous" src={`http://143.244.139.153:5000/${item.vThumbImage}`} alt="Thumb" style={{ width: '100px', height: 'auto' }} />}
                                    </td>
                                    <td>
                                        {item.vOriginalImage && <img crossOrigin="anonymous" src={`http://143.244.139.153:5000/${item.vOriginalImage}`} alt="Original" style={{ width: '100px', height: 'auto' }} />}
                                    </td>
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
