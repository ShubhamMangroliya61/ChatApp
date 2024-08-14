import React from 'react';
import CustomInput from '../../Components/shared/CustomInput';
import { Grid } from '@mui/material';
import CustomButton from '../../Components/shared/CustomButton';
import { useForm } from 'react-hook-form';
import { Regex } from '../../constatns/Regex';
import { AllRoutes } from '../../constatns/Routes';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup, useSelectorUserState } from '../../redux/slice/AuthSlice';
import LoaderComponent from '../../Components/Loader/Loader';
import Logo from '../../assets/ChatLogo.png'

const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isError, ErrorMessage, isLoading } = useSelectorUserState();

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(signup(data));
      if (response.meta.requestStatus === 'fulfilled') {
        navigate(AllRoutes.Login);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" mt={2} style={{ height: "90vh" }}>
      <LoaderComponent isLoader={isLoading} />
      <Grid item xs={11} sm={8} md={6} lg={4} xl={3}>
        <div className="p-5 rounded-lg shadow-md border-2 border-gray-100 bg-zinc-50">
          <img src={Logo} alt="Logo" className="w-24 h-auto mx-auto mb-2" />
          <div className='ms-2 me-5 mb-5 font-serif text-lg font-bold text-indigo-600 text-center'>
            Share Your Smile With this world and find Friends
          </div>

          {/* Email Field */}
          <CustomInput
            label="Email"
            placeholder="Email"
            type="email"
            required
            {...register("email", {
              required: "Email is required",
              pattern: { value: Regex.emailRegex, message: "Invalid email address" }
            })}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          {/* Username Field */}
          <CustomInput
            label="Username"
            placeholder="Username"
            type="text"
            required
            {...register("username", {
              required: "Username is required",
              pattern: { value: Regex.usernameRegex, message: "Invalid Username" }
            })}
          />
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}

          {/* Full Name Field */}
          <CustomInput
            label="Full Name"
            placeholder="Full Name"
            type="text"
            required
            {...register("Name", { required: "Full Name is required" })}
          />
          {errors.Name && <p className="text-red-500">{errors.Name.message}</p>}

          {/* Password Field */}
          <CustomInput
            label="Password"
            placeholder="Password"
            type={"password"}
            required
            {...register("password", {
              required: "Password is required",
              pattern: { value: Regex.passwordRegex, message: "Please Enter Valid Password (e.g.'xyz123@')" }
            })}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <div className='m-5'></div>
          <CustomButton title="Register" type="submit" className='w-full rounded-md text-lg bg-indigo-500 p-2 text-white' onClick={handleSubmit(onSubmit)} />

          {isError && <div className="text-center text-rose-500 mt-4">{ErrorMessage}</div>}

          <hr className='mt-4 mb-2' />
          <div className="text-center mt-5">
            <CustomButton title="Log In" route={AllRoutes.Login} className='bg-violet-500 text-lg text-white text-center p-2 rounded-lg' />
          </div>
        </div>
      </Grid>


    </Grid>
  );
};

export default SignUp;
