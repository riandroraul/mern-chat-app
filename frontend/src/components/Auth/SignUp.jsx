// import {} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios";
import {
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmpassword] = useState();
  const [picture, setPicture] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [invalid, setInvalid] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "password not matching!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URI}/api/user/register`,
        { name, email, password, picture },
        config
      );
      toast({
        title: "Register Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Register failed!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const postDetails = async (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please Select an Image!",
        // description: "We've created your account for you.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (
      pic.type === "image/jpg" ||
      pic.type === "image/jpeg" ||
      pic.type === "image/png"
    ) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      let res = await axios.post(
        "https://api.cloudinary.com/v1_1/dte6aijcq/image/upload",
        data
      );
      const urlPicture = res.data.url;
      setPicture(urlPicture.toString());
      setLoading(false);
    } else {
      toast({
        title: "Please Select an Image!",
        // description: "We've created your account for you.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          // isInvalid={invalid}
          // errorBorderColor="crimson"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              ml="14px"
              backgroundColor={show ? "gray.400" : ""}
              onClick={(e) => (!show ? setShow(true) : setShow(false))}
            >
              <ViewIcon boxSize={6} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Re-enter Your Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              ml="14px"
              backgroundColor={show ? "gray.400" : ""}
              onClick={(e) => (!show ? setShow(true) : setShow(false))}
            >
              <ViewIcon boxSize={6} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="picture" isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          variant="unstyled"
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        color="white"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
