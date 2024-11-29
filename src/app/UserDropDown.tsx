"use client";
import { signOut } from 'firebase/auth';
import { auth, fs, storage } from './firebaseConfig'; // Adjust the path based on your structure
import { toast } from 'react-hot-toast';
import blankProfile from './images/blankProfile.jpg';
import Image, { StaticImageData } from 'next/image';
import { getDownloadURL, uploadBytes, ref, updateMetadata } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';

interface UserDropdownProps {
    onClose: () => void;
    onUploadComplete?: (downloadURL: string) => void; // Optional prop for upload completion
}

const UserDropdown = ({ onClose, onUploadComplete }: UserDropdownProps) => {
    const user = auth.currentUser;
    const [profile, setProfile] = useState<string | StaticImageData>(blankProfile);
    const [notifications, setNotifications] = useState<Array<string>>();

    useEffect(() => {
        const user = auth.currentUser;
        if (user != null) {
            setProfile(user.photoURL || blankProfile);
        }

        let unsubscribe = () => { };

        const userRef = collection(fs, 'users');
        const q = doc(userRef, user?.uid);
        unsubscribe = onSnapshot(q, (doc) => {
            if (doc.exists()) {
                const data = doc.data().notification
                setNotifications(data);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        toast.success("Logged out successfully");
        onClose(); // Close the dropdown after logout
    };

    const metadata = {
        cacheControl: 'public,max-age=31536000',  // Cache for 1 year
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const user = auth.currentUser;
        if (file) {
            const storageRef = ref(storage, `profileImages/${user!.uid}`);

            try {
                toast.loading("Uploading file");
                await uploadBytes(storageRef, file);
                await updateMetadata(storageRef, metadata);
                const downloadURL = await getDownloadURL(storageRef);
                await updateProfile(user!, { photoURL: downloadURL });
                const userRef = collection(fs, 'users');
                await updateDoc(doc(userRef, user!.uid), {
                    imageURL: downloadURL,
                    updatedAt: new Date()
                });

                toast.dismiss();
                toast.success("File uploaded");
                setProfile(downloadURL);
                if (onUploadComplete) {
                    onUploadComplete(downloadURL);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                toast.error("Error uploading file");
            }
        }
    };

    return (
        <div className="absolute right-0 lg:top-10 top-16 w-64 lg:w-full bg-white border rounded-lg shadow-lg z-20">
            <div className="p-4 w-full flex flex-col items-center rounded-xl">
                <label className="cursor-pointer">
                    <div className="bg-black rounded-full h-40 w-40 relative overflow-hidden">
                        <Image
                            src={profile}
                            alt="photo"
                            layout="fill" // Use 'fill' to make the image fill the parent
                            objectFit="cover" // Ensure the image covers the container
                            className="rounded-full" // Ensure the image is also rounded
                        />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden" // Hide the input
                    />
                </label>
                <h3 className="font-bold text-center capitalize">{user?.displayName || "User"}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            {/* Recent notification */}
            <div>
                <h3 className="text-sm font-semibold p-2 text-black/30">Recent Notification</h3>
                <div className="p-2 border-t">
                    {notifications ?
                        <div className='flex gap-2 items-center'>
                            {notifications[2] === 'success' ?
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-full text-green-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                </svg> :
                                notifications[2] === 'error' ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-full text-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-full text-amber-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                    </svg>

                            }
                            <div>
                                <h4 className={`font-semibold text-sm ${notifications[2] === "error" ? "text-red-500" : notifications[2] === "success" ? "text-green-500" : "text-amber-500"}`}>{notifications[0]}</h4>
                                <p className="text-xs text-black/50">{notifications[1]}</p>
                            </div>
                        </div> :
                        <p className="text-xs text-center text-black">No new notifications</p>
                    }
                </div>
            </div>
            <Link
                href={"/about"}
                onClick={onClose}
                className="border-t p-2 items-center gap-5 hover:bg-gray-100 flex lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>

                <div
                    className="w-full text-left p-2"
                >
                    About
                </div>
            </Link>
            <Link
                href={"/#categories"}
                onClick={onClose}
                className="border-t p-2 items-center gap-5 hover:bg-gray-100 flex lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                </svg>

                <div
                    className="w-full text-left p-2"
                >
                    Menu
                </div>
            </Link>
            <Link
                href={"/#"}
                onClick={handleLogout}
                className="border-t p-2 flex items-center gap-5 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>

                <div
                    className="w-full text-left p-2"
                >
                    Logout
                </div>
            </Link>
        </div>
    );
};

export default UserDropdown;
