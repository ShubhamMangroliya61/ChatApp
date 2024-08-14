import { Avatar, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CustomButton from '../shared/CustomButton';
import { Controller, useForm } from 'react-hook-form';
import CustomInputField from '../shared/CustomInputField';
import { updateProfilePicture, UpdateUserProfile, useSelectorUserDataState } from '../../redux/slice/UserSlice';
import { Regex } from '../../constatns/Regex';
import { useDispatch } from 'react-redux';
import { UserDataById } from '../../redux/slice/AuthSlice';
import { showToaster } from '../../utils/ToasterService';
import { ToasterType } from '../../constatns/ToasterType';

const Profile = ({ showProfile, ProfileUserId }) => {
    const { handleSubmit, formState: { errors }, setValue, control, register, reset } = useForm();
    const [userData, setUserData] = useState("");
    const { user } = useSelectorUserDataState();
    const userId = localStorage.getItem("userId");
    const dispatch = useDispatch();

    useEffect(() => {
        if (user.userId != ProfileUserId) {
            const fetchData = async () => {
                try {
                    if (ProfileUserId) {
                        const response = await dispatch(UserDataById({ userId: ProfileUserId }));
                        setUserData(response.payload.data);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchData();
        }
    }, [ProfileUserId]);



    useEffect(() => {
        const setData = (data) => {
            setValue("email", data.email || "");
            setValue("username", data.userName || "");
            setValue("fullName", data.name || "");
        };
        if (user.userId == ProfileUserId) {
            setData(user);
        } else {
            setData(userData);
        }
    }, [setValue, user, userData, ProfileUserId]);

    const onSubmit = async (userdataupdate) => {
        try {
            const userDataupdate = {
                userId: userId,
                email: userdataupdate.email,
                userName: userdataupdate.username,
                name: userdataupdate.fullName,
            };
            const response = await dispatch(UpdateUserProfile(userDataupdate));

            if (response && response.payload.isSuccess) {
                showToaster(ToasterType.Success, "Profile updated successfully.");
            } else {
                showToaster(ToasterType.Error, response.payload.message ?? "Failed to update profile.");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showToaster(ToasterType.Error, "An error occurred while updating profile.");
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('ProfilePhoto', file);

                const success = await dispatch(updateProfilePicture(formData));
                if (success) {
                    showToaster(ToasterType.Success, "Profile picture updated successfully.");
                } else {
                    showToaster(ToasterType.Error, "Failed to update profile picture.");
                }
            } catch (error) {
                console.error('Error updating profile picture:', error);
            }
        }
    };

    return (
        <>
            {showProfile ? (
                <Box className="bg-gray-50 rounded-xl w-full mt-4 h-[90vh] text-center">
                    <Box className="flex justify-center pt-10">
                        <Avatar
                            alt="Profile Picture"
                            src={ProfileUserId === userId
                                ? user.profilePictureName
                                    ? `data:image/jpeg;base64,${user.profilePictureName}`
                                    : `data:image/jpeg;base64,${Regex.profile}`
                                : userData.profilePictureName
                                    ? `data:image/jpeg;base64,${userData.profilePictureName}`
                                    : `data:image/jpeg;base64,${Regex.profile}`}
                            sx={{ width: '130px', height: '130px' }}
                        />
                        <input
                            id="upload-photo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </Box>
                    {ProfileUserId === userId && (
                        <Box className="flex justify-center mt-4">
                            <CustomButton
                                title="Change Profile"
                                type="button"
                                onClick={() => document.getElementById('upload-photo').click()}
                                className='rounded-md text-lg ps-5 pe-5 p-1 bg-indigo-500 text-white'
                            />
                        </Box>
                    )}
                    <Box className="p-8">
                        <Controller
                            control={control}
                            name="email"
                            rules={{ required: true, pattern: Regex.emailRegex }}
                            render={({ field }) => (
                                <CustomInputField
                                    label="Email"
                                    id="email"
                                    placeholder="Email"
                                    error={errors.email && "Please enter a valid email address."}
                                    {...field}
                                />
                            )}
                        />

                        {/* Username Field */}
                        <Controller
                            control={control}
                            name="username"
                            rules={{ required: true, pattern: Regex.usernameRegex }}
                            render={({ field }) => (
                                <CustomInputField
                                    label="Username"
                                    id="username"
                                    placeholder="Username"
                                    error={errors.username && "Invalid Username(e.g.'Xyzxyz_.')"}
                                    {...field}
                                />
                            )}
                        />
                        {/* Full Name Field */}
                        <Controller
                            control={control}
                            name="fullName"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <CustomInputField
                                    label="Full Name"
                                    id="fullName"
                                    placeholder="Full Name"
                                    error={errors.fullName && "Please enter your full name."}
                                    {...field}
                                />
                            )}
                        />

                        {ProfileUserId === userId && (
                            <Box className="justify-end flex pt-3">
                                <CustomButton onClick={handleSubmit(onSubmit)} title="Save" type="submit" className='rounded-md text-lg ps-10 pe-10 p-1 bg-indigo-500 text-white' />
                            </Box>
                        )}
                    </Box>
                </Box>
            ) : (
                ""
            )}
        </>
    );
}

export default Profile;
