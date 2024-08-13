import { Avatar, Box, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { GetUserByUserName } from "../../redux/slice/UserSlice";
import { X, MagnifyingGlass } from "@phosphor-icons/react";
import LoaderComponent from "../Loader/Loader";
import { Regex } from "../../constatns/Regex";

const SearchUser = ({ closeModalHandler, CreateChat }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const [getData ,setgetData] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchData();
  }, [searchValue, pageNumber]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = {
        pageNumber,
        pageSize: 10,
        searchName: searchValue,
        model: {
          userId,
        },
      };
      const response = await dispatch(GetUserByUserName(data));
      if (response.payload && response.payload.data) {
        setSuggestions((prevSuggestions) => [
          ...prevSuggestions,
          ...response.payload.data.record,
        ]);
        if(pageNumber == response.payload.data.requirdPage){
          setgetData(false);
        }
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchHandle = (event) => {
    setSuggestions([]);
    setSearchValue(event.target.value);
    setPageNumber(1);
  };

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      if(getData)
      setPageNumber((prev) => prev + 1);
    }
  };

  return (
    <>
      <Box className="flex justify-between p-2 items-center bg-violet-200">
        <span className="font-semibold text-lg ps-3 text-indigo-600">Add Friend</span>
        <IconButton
          aria-label="close"
          onClick={closeModalHandler}
          sx={{
            position: 'absolute',
            right: 8,
            top: 0,
            color: 'indigo',
          }}
        >
          <X />
        </IconButton>
      </Box>

      <Box className="relative flex-1 pt-3 p-1">
        <div className="absolute inset-y-0 left-1 flex items-center ps-3 pt-2 pointer-events-none">
          <MagnifyingGlass className="text-gray-800" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-2 py-1 rounded-3xl bg-gray-100 focus:outline-none focus:bg-gray-100 border border-spacing-3"
          placeholder="Search User"
          id="my-search-input"
          value={searchValue}
          onChange={searchHandle}
        />
      </Box>
      <Box
        ref={scrollContainerRef}
        style={{ overflowY: "auto", maxHeight: "50vh", minHeight: "35vh"}}
        onScroll={handleScroll}
      >
        {suggestions.map((item, index) => (
          <Box key={item.userId} className="rounded-md border-s-indigo-600 border-s-8 ms-3 me-3 bg-purple-50">
            {/* <SearchUserList key={index} SearchUser={item} /> */}
            <Box key={index} display="flex" alignItems="center" justifyContent="space-between" margin={1} className="p-2">
              <div className='flex items-center'>
                <Avatar alt="Profile Picture" src={item.profilePictureName ?`data:image/jpeg;base64,${item.profilePictureName}`: `data:image/jpeg;base64,${Regex.profile}`} sx={{ width: 50, height: 50, marginRight: 1, marginLeft: 1 }} className='border-2' />
                <span className="flex justify-center align-baseline">
                  <b>{item.userName}</b>  
                </span>
              </div>
              <div>
                <button className="text-indigo-800 bg-violet-300 p-2 rounded-xl" onClick={() => CreateChat(item.userId)}>
                  Message
                </button>
              </div>
            </Box>
          </Box>
        ))}
        {loading && <LoaderComponent loading={loading} /> }
      </Box>
    </>
  );
};

export default SearchUser;
