import { Plus, Trash, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import api from '../api/api';
import { upLoadImage } from '../utils/cloudinary';
import { showError, showSuccess } from '../utils/notify';

function SmD11() {
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [cate, setCate] = useState('');
    const [image, setImage] = useState(null);
    const [listCate, setListCate] = useState([]);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [add, setAdd] = useState(false);
    const [update, setUpdate] = useState(false);
    const [del, setDel] = useState(null);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function getCategory() {
        try {
            const response = await api.get('/category');
            if (response.data.status == 200) {
                setListCate(response.data.items);
            }
        } catch (e) {
            console.log(e);
            showError('Có lỗi xảy ra');
        }
    }

    async function handleSearch(e) {
        e.preventDefault();
        if (search.trim() === '') {
            return;
        }

        setIsLoadingItems(true);
        try {
            const response = await api.get(`/product/name/${search.trim()}`);
            if (response.data.status === 200) {
                setItems(response.data.items);
            }
        } catch (e) {
            console.log(e);
            showError('Có lỗi xảy ra khi tìm kiếm');
        } finally {
            setIsLoadingItems(false);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        setIsAdding(true);
        const { status, url, public_id, message } = await upLoadImage(image);
        void public_id;
        if (status !== 200) {
            showError(message);
            setIsAdding(false);
            return;
        }

        try {
            const response = await api.post('/product', {
                name,
                cate,
                price,
                image: url,
            });

            if (response.data.status == 200) {
                showSuccess(response.data.message);
                await getAllItems();
                setAdd(false);
                resetVal();
            }
        } catch (e) {
            console.log(e);
            showError('Có lỗi xảy ra');
        } finally {
            setIsAdding(false);
        }
    }

    async function getAllItems() {
        setIsLoadingItems(true);
        try {
            const response = await api.get('/product');
            if (response.data.status == 200) {
                setItems(response.data.items);
            }
        } catch (e) {
            console.log(e);
            showError('Có lỗi xảy ra');
        } finally {
            setIsLoadingItems(false);
        }
    }

    async function handleDelete(idx) {
        setIsDeleting(true);
        try {
            const response = await api.delete(`/product/${idx}`);
            if (response.data.status == 200) {
                showSuccess(response.data.message);
                await getAllItems();
                setDel(null);
            } else {
                showError(response.data.message);
            }
        } catch (e) {
            console.log(e);
            showError('Có lỗi xảy ra');
        } finally {
            setIsDeleting(false);
        }
    }

    function handleSetUpdate(item) {
        setId(item.MaSP);
        setName(item.TenSP);
        setCate(item.MaDM);
        setPrice(item.GiaSP);
        setImage(null);
        setUpdate(true);
    }

    async function handleUpdate(e) {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('cate', cate);
            formData.append('price', price);
            if (image) {
                formData.append('image', image);
            }

            const response = await api.post(`/product/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.status == 200) {
                showSuccess(response.data.message);
                await getAllItems();
                setUpdate(false);
                resetVal();
            }
        } catch (e) {
            console.log(e);
            showError('Có lỗi xảy ra');
        } finally {
            setIsUpdating(false);
        }
    }

    function resetVal() {
        setId(0);
        setName('');
        setCate('');
        setPrice(0);
        setImage(null);
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
    }

    useEffect(() => {
        getCategory();
    }, []);

    useEffect(() => {
        getAllItems();
    }, []);

    return (
        <div className="w-full h-full relative">
            <div className="flex items-center justify-between p-9">
                <span className="text-3xl font-bold">Quản lý sản phẩm</span>
                <button
                    type="button"
                    onClick={() => setAdd(true)}
                    className="flex items-center rounded-[5px] bg-amber-400 p-2 text-xl text-white duration-75 hover:cursor-pointer hover:bg-amber-600"
                >
                    <Plus size={30} />
                    Thêm sản phẩm
                </button>
            </div>

            <form className="m-auto w-[95%]" onSubmit={handleSearch}>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearch(value);

                                if (value === '') {
                                    getAllItems();
                                }
                            }}
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full rounded-[5px] border border-gray-300 p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoadingItems}
                        className="flex min-w-32 items-center justify-center gap-2 rounded-[5px] bg-amber-400 px-4 py-2 font-bold text-white duration-200 hover:cursor-pointer hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoadingItems ? <ClipLoader loading={true} size={16} color="#ffffff" /> : null}
                        Tìm kiếm
                    </button>
                </div>
            </form>

            <div className="m-auto mt-5 h-[72%] w-[95%]">
                <table className="table-auto w-full bg-red-400">
                    <thead>
                        <tr className="grid grid-cols-5 bg-gray-200 text-md text-gray-500">
                            <th className="col-span-1 p-2">SẢN PHẨM</th>
                            <th className="col-span-1 p-2">DANH MỤC</th>
                            <th className="col-span-1 p-2">GIÁ</th>
                            <th className="col-span-1 p-2">HÌNH ẢNH</th>
                            <th className="col-span-1 p-2">THAO TÁC</th>
                        </tr>
                    </thead>
                </table>
                <div className="h-[400px] w-full overflow-y-scroll">
                    {isLoadingItems ? (
                        <div className="flex h-full items-center justify-center bg-gray-100">
                            <ClipLoader loading={true} size={36} color="#f59e0b" />
                        </div>
                    ) : (
                        <table className="table-auto w-full">
                            <tbody className="divide-y-2 divide-gray-300">
                                {items.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="grid h-auto grid-cols-5 divide-x-2 divide-gray-300 bg-gray-100 font-bold"
                                    >
                                        <td className="col-span-1 flex items-center justify-center p-2">{item.TenSP}</td>
                                        <td className="col-span-1 flex items-center justify-center p-2">{item.TenDM}</td>
                                        <td className="col-span-1 flex items-center justify-center p-2">
                                            {formatCurrency(item.GiaSP)}
                                        </td>
                                        <td className="col-span-1 flex items-center justify-center p-2">
                                            <img className="h-20 w-20" src={item.image_url} alt="pic" />
                                        </td>
                                        <td className="col-span-1 flex items-center justify-center gap-10 p-2 text-white">
                                            <button
                                                type="button"
                                                disabled={isUpdating || isDeleting}
                                                className="flex gap-2 rounded-[5px] bg-blue-500 p-2 duration-75 hover:scale-[1.1] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                                                onClick={() => handleSetUpdate(item)}
                                            >
                                                Sửa
                                                <Pencil size={20} />
                                            </button>

                                            <button
                                                type="button"
                                                disabled={isUpdating || isDeleting}
                                                className="flex gap-2 rounded-[5px] bg-red-500 p-2 duration-75 hover:scale-[1.1] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                                                onClick={() => setDel(item)}
                                            >
                                                Xóa
                                                <Trash size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {add && (
                <div className="fixed top-0 right-0 bottom-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/30">
                    <form
                        className="flex w-[90%] max-w-[500px] flex-col gap-6 rounded-lg bg-white px-6 py-8 shadow-2xl"
                        onSubmit={handleAdd}
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-gray-800">Thêm sản phẩm</h2>
                            <button
                                type="button"
                                disabled={isAdding}
                                className="text-4xl font-bold text-gray-400 hover:cursor-pointer hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => {
                                    setAdd(false);
                                    resetVal();
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="item_name" className="text-lg font-semibold text-gray-700">
                                Tên sản phẩm:
                            </label>
                            <input
                                className="rounded-lg border border-gray-300 p-3 text-base focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                id="item_name"
                                placeholder="Nhập tên sản phẩm"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="item_cate" className="text-lg font-semibold text-gray-700">
                                Danh mục:
                            </label>
                            <select
                                id="item_cate"
                                className="rounded-lg border border-gray-300 p-3 text-base focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                                value={cate}
                                onChange={(e) => setCate(e.target.value)}
                                required
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {listCate.map((item) => (
                                    <option key={item.MaDM} value={item.MaDM}>
                                        {item.TenDM}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="item_price" className="text-lg font-semibold text-gray-700">
                                Giá sản phẩm:
                            </label>
                            <input
                                className="rounded-lg border border-gray-300 p-3 text-base focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                id="item_price"
                                placeholder="Nhập giá sản phẩm"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="item_image" className="text-lg font-semibold text-gray-700">
                                Hình ảnh:
                            </label>
                            <input
                                className="rounded-lg border border-gray-300 p-3 text-base file:mr-4 file:rounded-lg file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-amber-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                                onChange={(e) => setImage(e.target.files[0])}
                                type="file"
                                id="item_image"
                                accept="image/*"
                                required
                            />
                        </div>

                        <button
                            disabled={isAdding}
                            className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 py-3 text-lg font-bold text-white duration-200 hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                            type="submit"
                        >
                            {isAdding ? <ClipLoader loading={true} size={18} color="#ffffff" /> : null}
                            {isAdding ? 'Đang thêm...' : 'Thêm sản phẩm'}
                        </button>
                    </form>
                </div>
            )}

            {update && (
                <div className="fixed top-0 right-0 bottom-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/30">
                    <form
                        className="flex w-[90%] max-w-[500px] flex-col gap-6 rounded-lg bg-white px-6 py-8 shadow-2xl"
                        onSubmit={handleUpdate}
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-gray-800">Cập nhật sản phẩm</h2>
                            <button
                                type="button"
                                disabled={isUpdating}
                                className="text-4xl font-bold text-gray-400 hover:cursor-pointer hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => {
                                    setUpdate(false);
                                    resetVal();
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="item_name_update" className="text-lg font-semibold text-gray-700">
                                Tên sản phẩm:
                            </label>
                            <input
                                className="rounded-lg border border-gray-300 p-3 text-base focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                id="item_name_update"
                                placeholder="Nhập tên sản phẩm"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="item_cate_update" className="text-lg font-semibold text-gray-700">
                                Danh mục:
                            </label>
                            <select
                                id="item_cate_update"
                                className="rounded-lg border border-gray-300 p-3 text-base focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                                value={cate}
                                onChange={(e) => setCate(e.target.value)}
                                required
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {listCate.map((item) => (
                                    <option key={item.MaDM} value={item.MaDM}>
                                        {item.TenDM}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="item_price_update" className="text-lg font-semibold text-gray-700">
                                Giá sản phẩm:
                            </label>
                            <input
                                className="rounded-lg border border-gray-300 p-3 text-base focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                id="item_price_update"
                                placeholder="Nhập giá sản phẩm"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="item_image_update" className="text-lg font-semibold text-gray-700">
                                Hình ảnh:
                            </label>
                            <input
                                className="rounded-lg border border-gray-300 p-3 text-base file:mr-4 file:rounded-lg file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-amber-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                                onChange={(e) => setImage(e.target.files[0])}
                                type="file"
                                id="item_image_update"
                                accept="image/*"
                            />
                        </div>

                        <button
                            disabled={isUpdating}
                            className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 py-3 text-lg font-bold text-white duration-200 hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                            type="submit"
                        >
                            {isUpdating ? <ClipLoader loading={true} size={18} color="#ffffff" /> : null}
                            {isUpdating ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
                        </button>
                    </form>
                </div>
            )}

            {del && (
                <div className="fixed top-0 right-0 bottom-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/30">
                    <div className="flex w-[90%] max-w-[400px] flex-col gap-6 rounded-lg bg-white px-6 py-8 shadow-2xl">
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">Xác nhận xóa</h2>
                        </div>

                        <p className="text-lg text-gray-700">
                            Bạn có chắc chắn muốn xóa sản phẩm "{del.TenSP}" này không?
                        </p>

                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                type="button"
                                disabled={isDeleting}
                                className="rounded-lg bg-gray-400 px-6 py-2 text-base font-bold text-white duration-200 hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => setDel(null)}
                            >
                                Không
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-red-500 px-6 py-2 text-base font-bold text-white duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => handleDelete(del.MaSP)}
                            >
                                {isDeleting ? <ClipLoader loading={true} size={16} color="#ffffff" /> : null}
                                {isDeleting ? 'Đang xóa...' : 'Có, xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SmD11;
