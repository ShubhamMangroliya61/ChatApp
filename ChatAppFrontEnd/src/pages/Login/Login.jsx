import Grid from '@mui/material/Grid';
import CustomInput from '../../Components/shared/CustomInput';
import CustomButton from '../../Components/shared/CustomButton';
import { useForm } from 'react-hook-form';
import { AllRoutes } from '../../constatns/Routes';
import { Regex } from '../../constatns/Regex';
import { login, useSelectorUserState } from '../../redux/slice/AuthSlice';
import { useDispatch } from 'react-redux';
import LoaderComponent from '../../Components/Loader/Loader';
import Logo from '../../assets/ChatLogo.png'
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { WidthFull } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [user, setUser] = useState([]);
    const disPatch = useDispatch();
    const { isError, ErrorMessage, isLoading } = useSelectorUserState();

    const onSubmit = async (data) => {
        
            await disPatch(login(data));
           
    };

    // const login = useGoogleLogin({
    //     onSuccess: (codeResponse) => setUser(codeResponse),
    //     onError: (error) => console.log('Login Failed:', error)
    // });
    // useEffect(
    //     () => {
    //         if (user) {
    //             user == [] ? console.log(user) : console.log("Empty user")
    //             axios
    //                 .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
    //                     headers: {
    //                         Authorization: `Bearer ${user.access_token}`,
    //                         Accept: 'application/json'
    //                     }
    //                 })
    //                 .then((res) => {
    //                     console.log(res.data);
    //                     console.log("data assigned");
    //                 })
    //                 .catch((err) => console.log(err));
    //         }
    //     },
    //     [user]
    // );
    
    return (

        <Grid container justifyContent="center" alignItems="center" mt={2} style={{ height: "90vh" }}>
            <LoaderComponent isLoader={isLoading} />

            <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
                <div className="p-5 rounded-lg shadow-md border-2 border-gray-100 bg-zinc-50">

                    <img src={Logo} alt="Logo" className="w-32 h-auto mx-auto mb-5" />
                    <div className='mb-5 font-serif text-2xl font-bold text-indigo-600 text-center'   >
                        Welcome to ChatApp
                    </div>
                    <CustomInput
                        label="Email"
                        // name="email"
                        placeholder="Please Enter your Email"
                        type="text"
                        required
                        {...register("email", { required: true, pattern: Regex.emailRegex })}
                    />
                    {errors.email && <p className="text-red-500">Please enter a valid email address.</p>}

                    <CustomInput
                        label="Password"
                        // name="password"
                        placeholder="Password"
                        type="password"
                        required
                        {...register("password", { required: true, pattern: Regex.passwordRegex })}
                    />
                    {errors.password && <p className="text-red-500">Password must be 7 to 15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.</p>}

                    {isError && (
                        <div className="text-center text-rose-500 mt-3">{ErrorMessage}</div>
                    )}

                    <div className='m-5'></div>
                    <CustomButton title="Log In" type="submit" className='w-full rounded-md text-lg bg-indigo-500 p-2 text-white' onClick={handleSubmit(onSubmit)} />

                    <div className='mt-3 text-center'>
                        <a className='text-lg' href="#">Forgot Password?</a>
                    </div>

                    <hr className='mt-2 mb-2' />
                    <div className="text-center mt-5">
                        <CustomButton title="Create New Account" route={AllRoutes.SignUp} className='bg-violet-500 text-lg text-white text-center p-2 rounded-lg' />
                    </div>
                </div>
                {/* <div className="p-5 rounded-lg shadow-md border-2 border-gray-100 bg-zinc-50 flex justify-center">
                <CustomButton title="Login with Google" onClick={login} className='bg-violet-500 text-lg text-white text-center p-2 rounded-lg' />
                </div> */}
            </Grid>
        </Grid>
    );
}

export default Login;
