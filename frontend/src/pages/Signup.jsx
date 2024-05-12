import { React, useState } from 'react'
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from 'axios'

const Signup = () => {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleClick = () => {
    axios.post('http://localhost:4000/api/v1/user/signup', {
      firstName,
      lastName,
      username,
      password
    }).then(response => {
      console.log(response.data)
    }).catch(error => {
      console.log(error)
    })
  }

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox onChange={e => { setFirstName(e.target.value) }} placeholder="John" label={"First Name"} />
          <InputBox onChange={e => { setLastName(e.target.value) }} placeholder="Doe" label={"Last Name"} />
          <InputBox onChange={e => { setUsername(e.target.value) }} placeholder="geekymonk@gmail.com" label={"Email"} />
          <InputBox onChange={e => { setPassword(e.target.value) }} placeholder="123456" label={"Password"} />
          <div className="pt-4">
            <Button onClick={handleClick} label={"Sign up"} />
          </div>
          <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
        </div>
      </div>
    </div>
  )
}

export default Signup