import { useEffect, useState } from "react";
import { Inputs } from "../reusables/formcomponent/Inputs";
import Button from "../reusables/formcomponent/Button";
import { Select } from "../reusables/formcomponent/Select";
import { BackgroundDialogue } from "../reusables/BackgroundDialogue";
import { CloseDiagComp } from "../reusables/CloseDiagComp";
import TableComponent from "../reusables/TableComponent";
import Dropdown from "../reusables/ActionComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SuccessBlock } from "../reusables/SuccessBlock";
import { ErrorBlock } from "../reusables/ErrorBlock";
import { Encrypt } from "../helperfunctions/functions";
import { DeleteDialogue } from "../reusables/DeleteDialogue";
import { InputItem } from "../../Interfaces/usersInterface";

interface transformData {
  nameofcompany: string;
  startdate: string;
  enddate: string;
  position: string;
}

interface ListMembers {
  [x: string]: string | number;
  firtname: string;
  lastname: string;
  email: string;
  gender: string;
  children: number;
}

type Prop = {
  listallMembers?: ListMembers[];
  refetch?: () => void;
};

export const AddMembersComponent = (props: Prop) => {
  const navigate = useNavigate();
  const [memberid, setMemberid] = useState<number>(0);
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPasword] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [placeOfBirth, setPlaceOfBirth] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [selectedOccupation, setSelectedOccupation] = useState<transformData[]>(
    [],
  );
  const [nationality, setNationality] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [mothersName, setMothersName] = useState<string>("");
  const [fathersName, setFathersName] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [numberOfChildren, setNumberOfChildren] = useState<number>(0);
  const [primaryEducation, setPrimaryEducation] = useState<string>("");
  const [secondaryEducation, setSecondaryEducation] = useState<string>("");
  const [tertiaryEducation, setTertiaryEducation] = useState<string>("");
  const [hometown, setHometown] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successBlockStatus, setSuccessBlockStatus] = useState<boolean>(false);
  const [errorBlockStatus, setErrorBlockStatus] = useState<boolean>(false);
  const [blockMessage, setBlockMessage] = useState<string>("");
  const [emitStatus, setEmitStatus] = useState<string>("");
  const [editOccupation, setEditOccupation] = useState<transformData[]>([]);
  const [popupdelete, setPopupdelete] = useState<boolean>(false);
  const [delete_id, setDelete_id] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const id = event.currentTarget.id;

    if (id === "firstname") {
      setFirstname(value);
    } else if (id === "lastname") {
      setLastname(value);
    } else if (id === "email") {
      setEmail(value);
    } else if (id === "password") {
      setPasword(value);
    } else if (id === "gender") {
      setGender(value);
    } else if (id === "dateofbirth") {
      setDateOfBirth(value);
    } else if (id === "placeofbirth") {
      setPlaceOfBirth(value);
    } else if (id === "occupation") {
      setOccupation(value);
    } else if (id === "nationality") {
      setNationality(value);
    } else if (id === "phonenumber") {
      setPhoneNumber(value);
    } else if (id === "mothersname") {
      setMothersName(value);
    } else if (id === "fathersname") {
      setFathersName(value);
    } else if (id === "maritalstatus") {
      setMaritalStatus(value);
    } else if (id === "numberofchildren") {
      setNumberOfChildren(parseInt(value));
    } else if (id === "primaryeducation") {
      setPrimaryEducation(value);
    } else if (id === "secondaryeducation") {
      setSecondaryEducation(value);
    } else if (id === "tertiaryeducation") {
      setTertiaryEducation(value);
    } else if (id === "hometown") {
      setHometown(value);
    }
  };

  const handleOccupations = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOccupation(event.currentTarget.value);
  };

  const onClick = () => {
    if (editOccupation?.length > 0) {
      setOccupation("");
    } else {
      setOccupation("");
      setInputs([]);
    }
  };

  const [inputs, setInputs] = useState([
    {
      id: "companyname",
      label: "Companyname:",
      type: "text",
      placeholder: "Enter your companyname...",
      value: "",
    },
    {
      id: "startdate",
      label: "Startdate:",
      type: "date",
      placeholder: "Select start date...",
      value: "",
    },
    {
      id: "enddate",
      label: "Enddate:",
      type: "date",
      placeholder: "Select end date...",
      value: "",
    },
    {
      id: "position",
      label: "Position:",
      type: "text",
      placeholder: "Enter position here...",
      value: "",
    },
  ]);

  //handles creating a copy of the input tags
  const handleAddFieldCopy = () => {
    setInputs((prevInputs) => [
      ...prevInputs,
      {
        id: `companyname`,
        label: "Companyname:",
        type: "text",
        placeholder: "Enter your companyname...",
        value: "",
      },
      {
        id: `startdate`,
        label: "Startdate:",
        type: "date",
        placeholder: "Select start date...",
        value: "",
      },
      {
        id: `enddate`,
        label: "Enddate:",
        type: "date",
        placeholder: "Select end date...",
        value: "",
      },
      {
        id: `position`,
        label: "Position:",
        type: "text",
        placeholder: "Enter position here...",
        value: "",
      },
    ]);
  };

  //removal of input arrays
  const handleRemoveFieldCopy = () => {
    setInputs((prevInputs) => prevInputs.slice(0, prevInputs?.length - 4));
  };

  //handles the change for every inputs
  const handleCopyChange = (
    e: { target: { value: string } },
    index: number,
  ) => {
    const newInputs = [...inputs];
    newInputs[index].value = e.target.value;
    setInputs(newInputs);
  };

  const handleSlice = () => {
    const chunks: InputItem[][] = [];
    for (let i = 0; i < inputs?.length; i += 4) {
      const chunk = inputs.slice(i, i + 4);
      chunks.push(chunk);
    }

    const transformedData = chunks.map((chunk) => {
      return {
        nameofcompany: chunk[0].value,
        startdate: chunk[1].value,
        enddate: chunk[2].value,
        position: chunk[3].value,
      };
    });

    setSelectedOccupation(transformedData);
    onClick();
    setInputs([]);
  };

  // edit input tag for occupation selection
  const handleEditFieldCopy = (occupationData: transformData) => {
    setInputs((prevInputs) => [
      ...prevInputs,
      {
        id: `companyname-${prevInputs?.length}`,
        label: "Companyname:",
        type: "text",
        placeholder: "Enter your companyname...",
        value: occupationData.nameofcompany,
      },
      {
        id: `startdate-${prevInputs?.length}`,
        label: "Startdate:",
        type: "date",
        placeholder: "Select start date...",
        value: occupationData.startdate,
      },
      {
        id: `enddate-${prevInputs?.length}`,
        label: "Enddate:",
        type: "date",
        placeholder: "Select end date...",
        value: occupationData.enddate,
      },
      {
        id: `position-${prevInputs?.length}`,
        label: "Position:",
        type: "text",
        placeholder: "Enter position here...",
        value: occupationData.position,
      },
    ]);
  };

  useEffect(() => {
    if (editOccupation?.length > 0) {
      editOccupation.forEach((occupationData) => {
        handleEditFieldCopy(occupationData);
      });
    }
  }, [editOccupation]);

  //creating or mutation code here

  const handleCreationOfMember = async () => {
    try {
      setIsLoading(true);

      let response = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/createmember`,
        {
          firstname: firstname,
          lastName: lastname,
          email: email,
          password: password,
          gender: gender,
          dateofbirth: dateOfBirth,
          placeofbirth: placeOfBirth,
          occupation: selectedOccupation,
          nationality: nationality,
          phonenumber: phoneNumber,
          mothersname: mothersName,
          fathersname: fathersName,
          maritalstatus: maritalStatus,
          numberofchildren: numberOfChildren,
          primaryeducation: primaryEducation,
          secondaryeducation: secondaryEducation,
          tertiaryeducation: tertiaryEducation,
          hometown: hometown,
        },
      );

      if (response && response?.data?.code === 200) {
        setSuccessBlockStatus(true);
        setBlockMessage(response?.data?.message);
        setTimeout(() => {
          setSuccessBlockStatus(false);
          setBlockMessage("");
          props.refetch && props.refetch();
        }, 3000);
        resetStates();
      }
    } catch (error: any) {
      console.error(error);
      setErrorBlockStatus(true);
      setBlockMessage(error.response?.data?.message);
      setTimeout(() => {
        setErrorBlockStatus(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  //edit mutation code here
  const handleEditOfMember = async () => {
    try {
      setIsLoading(true);

      let response = await axios.put(
        `${import.meta.env.VITE_ENDPOINT}/updatemembers`,
        {
          updated_id: memberid,
          firstname: firstname,
          lastName: lastname,
          email: email,
          gender: gender,
          dateofbirth: dateOfBirth,
          placeofbirth: placeOfBirth,
          occupation: selectedOccupation,
          nationality: nationality,
          phonenumber: phoneNumber,
          mothersname: mothersName,
          fathersname: fathersName,
          maritalstatus: maritalStatus,
          numberofchildren: numberOfChildren,
          primaryeducation: primaryEducation,
          secondaryeducation: secondaryEducation,
          tertiaryeducation: tertiaryEducation,
          hometown: hometown,
        },
      );

      if (response && response?.data?.code === 200) {
        setSuccessBlockStatus(true);
        setBlockMessage(response?.data?.message);
        setTimeout(() => {
          setSuccessBlockStatus(false);
          setBlockMessage("");
          props.refetch && props.refetch();
        }, 3000);
        resetStates();
      }
    } catch (error: any) {
      console.error(error);
      setErrorBlockStatus(true);
      setBlockMessage(error.message);
      setTimeout(() => {
        setErrorBlockStatus(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  //handle delete mutations here....
  const handleDelete = async () => {
    try {
      setIsLoading(true);

      let response = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/deletemember`,
        {
          user_id: delete_id,
        },
      );

      if (response && response?.data?.code === 200) {
        setSuccessBlockStatus(true);
        setBlockMessage(response?.data?.message);
        setTimeout(() => {
          setSuccessBlockStatus(false);
          setBlockMessage("");
          props.refetch && props.refetch();
        }, 3000);
        resetStates();
      }
    } catch (error: any) {
      console.error(error);
      setErrorBlockStatus(true);
      setBlockMessage(error.message);
      setTimeout(() => {
        setErrorBlockStatus(false);
      }, 3000);
    } finally {
      setIsLoading(false);
      setPopupdelete(false);
    }
  };

  //clear
  const resetStates = () => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setPasword("");
    setGender("");
    setDateOfBirth("");
    setPlaceOfBirth("");
    setOccupation("");
    setSelectedOccupation([]);
    setNationality("");
    setPhoneNumber("");
    setMothersName("");
    setFathersName("");
    setMaritalStatus("");
    setNumberOfChildren(0);
    setPrimaryEducation("");
    setSecondaryEducation("");
    setTertiaryEducation("");
    setHometown("");
    setEmitStatus("");
    setEditOccupation([]);
  };

  //table codes down here
  //this is for handling the action component
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropDownId, setDropDownId] = useState<number>(0);
  const handleMouseClick = (param: number) => {
    setIsDropdownOpen(true);
    setDropDownId(param);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const [isShow, setIsShow] = useState<boolean>(false);

  const handleClose = () => {
    setIsShow(!isShow);
  };

  const headers = [
    { key: "Firstname", label: "Firstname" },
    { key: "Lastname", label: "Lastname" },
    { key: "Email", label: "Email" },
    { key: "Gender", label: "Gender" },
    { key: "Hometown", label: "Hometown" },
    { key: "action", label: "Actions" },
  ];

  const handleCancelDiag = () => {
    setPopupdelete(false);
  };

  const renderCellContent = (headerKey: string, item: Record<string, any>) => {
    switch (headerKey) {
      case "Firstname":
        return <div className="whitespace-nowrap">{item.firstname}</div>;

      case "Lastname":
        return <div className="whitespace-nowrap">{item.lastname}</div>;

      case "Email":
        return <div className="whitespace-nowrap">{item.email}</div>;

      case "Gender":
        return <div className="whitespace-nowrap">{item.gender}</div>;

      case "Hometown":
        return <div className="whitespace-nowrap">{item.hometown}</div>;

      case "action":
        function emitAction(_id: string | number, _label: string): void {
          // handling action emit

          if (_label === "Edit") {
            setEmitStatus(_label);
            const member = props.listallMembers?.find(
              (user) => user?.id === _id,
            );

            if (member) {
              setMemberid(Number(member.id));
              setFirstname(member.firstname.toString());
              setLastname(member.lastname);
              setEmail(member.email);
              setGender(member.gender);
              setDateOfBirth(member.dateofbirth.toString().split("T")[0]);
              setPlaceOfBirth(member.placeofbirth.toString());
              setNationality(member.nationality.toString());
              setPhoneNumber(member.phonenumber.toString());
              setMothersName(member.mothersname.toString());
              setFathersName(member.fathersname.toString());
              setMaritalStatus(member.maritalstatus.toString());
              setNumberOfChildren(Number(member.numberofchildren));
              setPrimaryEducation(member.primaryeducation.toString());
              setSecondaryEducation(member.secondaryeducation.toString());
              setTertiaryEducation(member.tertiaryeducation.toString());
              setHometown(member.hometown.toString());
              setEditOccupation(
                typeof member.occupation === "string"
                  ? JSON.parse(member.occupation)
                  : [],
              );
              handleClose(); //closes the table display
              setInputs([]); //clears the empty fileds populated in the input array for occupation
            }
          }

          if (_label === "View") {
            navigate(`/profile/${Encrypt(_id.toString())}`);
            handleClose(); //closes the table display
          }

          if (_label === "Delete") {
            setPopupdelete(true);
            setDelete_id(Number(_id));
            handleClose(); //closes the table display
          }
        }

        return (
          <div className="whitespace-nowrap">
            <img
              src="/images/flatEclipse.svg"
              alt="eclipse"
              className="cursor-pointer"
              onClick={() => handleMouseClick(item.id)}
            />

            <div className="absolute right-[30px]">
              {isDropdownOpen && dropDownId === item.id && (
                <Dropdown
                  onMouseLeave={handleMouseLeave}
                  dropdownItems={[
                    {
                      id: item.id,
                      image: "/images/view.svg",
                      label: "View",
                      dataCy: "view",
                    },
                    {
                      id: item.id,
                      image: "/images/editicon.svg",
                      label: "Edit",
                      dataCy: "edit",
                    },
                    {
                      id: item.id,
                      image: "/images/delete.svg",
                      label: "Delete",
                      dataCy: "delete",
                    },
                  ]}
                  emitAction={emitAction}
                />
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SuccessBlock blockControl={successBlockStatus} message={blockMessage} />
      <ErrorBlock blockControl={errorBlockStatus} message={blockMessage} />
      <DeleteDialogue
        text={`(user_id ${delete_id})`}
        popup={popupdelete}
        loading={isLoading}
        onCancel={handleCancelDiag}
        onDelete={handleDelete}
      />
      <div className="w-full bg-white p-2 text-center font-bold text-xl">
        {emitStatus === "Edit" ? "Edit Member Form" : "Add Member Form"}
      </div>

      <div className="w-full shadow-md p-10 mt-1 bg-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Inputs
          type="text"
          style={
            firstname === ""
              ? "w-full border-2 border-red-300 h-8 rounded-xl text-gray-500 outline-red-300 p-5 placeholder:text-sm"
              : "w-full border-2 border-cyan-300 h-8 rounded-xl text-gray-500 outline-cyan-300 p-5 placeholder:text-sm"
          }
          labelStyle={firstname === "" ? "text-red-300" : ""}
          id={"firstname"}
          labelOne="Firstname:"
          placeholder="Enter your username..."
          onChange={handleChange}
          value={firstname}
        />

        <Inputs
          type="text"
          style={
            lastname === ""
              ? "w-full border-2 border-red-300 h-8 rounded-xl text-gray-500 outline-red-300 p-5 placeholder:text-sm"
              : "w-full border-2 border-cyan-300 h-8 rounded-xl text-gray-500 outline-cyan-300 p-5 placeholder:text-sm"
          }
          labelStyle={lastname === "" ? "text-red-300" : ""}
          id={"lastname"}
          labelOne="Lastname:"
          placeholder="Enter your lastname..."
          onChange={handleChange}
          value={lastname}
        />

        <Inputs
          type="email"
          style={
            /^[\w-]+(\.[\w-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(
              email,
            ) === false
              ? "w-full border-2 border-red-300 h-8 rounded-xl text-gray-500 outline-red-300 p-5 placeholder:text-sm"
              : "w-full border-2 border-cyan-300 h-8 rounded-xl text-gray-500 outline-cyan-300 p-5 placeholder:text-sm"
          }
          labelStyle={
            /^[\w-]+(\.[\w-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(
              email,
            ) === false
              ? "text-red-300"
              : ""
          }
          id={"email"}
          labelOne="Email:"
          placeholder="Enter your email..."
          onChange={handleChange}
          value={email}
        />

        {emitStatus === "Edit" ? (
          ""
        ) : (
          <Inputs
            type="password"
            style={
              /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).{8,}$/.test(
                password,
              ) === false
                ? "w-full border-2 border-red-300 h-8 rounded-xl text-gray-500 outline-red-300 p-5 placeholder:text-sm"
                : "w-full border-2 border-cyan-300 h-8 rounded-xl text-gray-500 outline-cyan-300 p-5 placeholder:text-sm"
            }
            labelStyle={
              /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).{8,}$/.test(
                password,
              ) === false
                ? "text-red-300"
                : ""
            }
            id={"password"}
            labelOne="Password:"
            placeholder="Enter your password..."
            onChange={handleChange}
            value={password}
          />
        )}

        <Inputs
          type="text"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"gender"}
          labelOne="Gender:"
          placeholder="Enter your gender..."
          onChange={handleChange}
          value={gender}
        />
        <Inputs
          type="date"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"dateofbirth"}
          labelOne="Date of Birth:"
          placeholder="Enter your date of birth..."
          onChange={handleChange}
          value={dateOfBirth}
        />
        <Inputs
          type="text"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"placeofbirth"}
          labelOne="Place of Birth:"
          placeholder="Enter your place of birth..."
          onChange={handleChange}
          value={placeOfBirth}
        />

        <Select
          labelOne={`Occupation`}
          labelTwo={`${editOccupation?.length > 0 ? editOccupation?.length : selectedOccupation?.length}`}
          style="
                  w-full rounded-xl
                  p-2 border-2 border-cyan-300
                  dark:placeholder-gray-400 
                  dark:text-white dark:focus:ring-[#F2BEAB] 
                  dark:focus:border-cyan-300 mb-4
                  "
          data={[{ id: "1", name: "selected occupations" }]}
          placeholder={"Select occupations"}
          value={selectedOccupation?.length > 0 ? "1" : occupation}
          onChange={handleOccupations}
        />

        <BackgroundDialogue
          status={occupation == "1" ? true : false}
          backgroundColor=""
        >
          <div className="w-[60%] bg-white p-5 rounded-md">
            <div className="flex">
              <div className="w-[50%] text-center">
                {emitStatus === "Edit" ? (
                  <p className="text-xl font-bold">Edit Occupations</p>
                ) : (
                  <p className="text-xl font-bold">Add Occupation</p>
                )}
              </div>
              <CloseDiagComp
                styles="w-[50%] flex justify-end -mt-2"
                onClick={onClick}
              />
            </div>
            <div className="w-[100%] flex justify-end">
              <Button
                buttonLabel="Add fields"
                className="w-fit border p-2 
                rounded-xl text-white bg-emerald-400"
                onClick={handleAddFieldCopy}
              />

              <Button
                buttonLabel="Remove fields"
                className="w-fit border p-2 
                rounded-xl text-white bg-red-400"
                onClick={handleRemoveFieldCopy}
              />
            </div>
            <div className="flex gap-2 justify-center">
              <div className="pb-4 grid grid-cols-4 gap-2">
                {inputs.map((input, index) => (
                  <Inputs
                    key={index}
                    type={input.type}
                    style="w-full border-2 border-cyan-300 h-8 rounded-xl 
                    text-gray-500 outline-cyan-300 p-5 placeholder:text-sm"
                    id={input.id}
                    labelOne={input.label}
                    placeholder={input.placeholder}
                    onChange={(e) => handleCopyChange(e, index)}
                    value={input.value}
                  />
                ))}
              </div>
            </div>
            <div className="p-2 flex justify-end">
              <Button
                buttonLabel="Ok"
                className="w-[10%] border p-2 
                rounded-xl text-white bg-cyan-400"
                onClick={handleSlice}
              />

              <Button
                buttonLabel="Cancel"
                className="w-[10%] border p-2 
                rounded-xl text-white bg-red-400"
                onClick={onClick}
              />
            </div>
          </div>
        </BackgroundDialogue>

        <Inputs
          type="text"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"nationality"}
          labelOne="Nationality:"
          placeholder="Enter your nationality..."
          onChange={handleChange}
          value={nationality}
        />
        <Inputs
          type="text"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"phonenumber"}
          labelOne="Phone Number:"
          placeholder="Enter your phone number..."
          onChange={handleChange}
          value={phoneNumber}
        />
        <Inputs
          type="text"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"mothersname"}
          labelOne="Mother's Name:"
          placeholder="Enter your mother's name..."
          onChange={handleChange}
          value={mothersName}
        />
        <Inputs
          type="text"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"fathersname"}
          labelOne="Father's Name:"
          placeholder="Enter your father's name..."
          onChange={handleChange}
          value={fathersName}
        />
        <Inputs
          type="text"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"maritalstatus"}
          labelOne="Marital Status:"
          placeholder="Enter your marital status..."
          onChange={handleChange}
          value={maritalStatus}
        />
        <Inputs
          type="number"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"numberofchildren"}
          labelOne="Number of Children:"
          placeholder="Enter number of children..."
          onChange={handleChange}
          value={numberOfChildren.toString()}
        />
        <Inputs
          type="text"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"primaryeducation"}
          labelOne="Primary Education:"
          placeholder="Enter your primary education..."
          onChange={handleChange}
          value={primaryEducation}
        />
        <Inputs
          type="text"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"secondaryeducation"}
          labelOne="Secondary Education:"
          placeholder="Enter your secondary education..."
          onChange={handleChange}
          value={secondaryEducation}
        />
        <Inputs
          type="text"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"tertiaryeducation"}
          labelOne="Tertiary Education:"
          placeholder="Enter your tertiary education..."
          onChange={handleChange}
          value={tertiaryEducation}
        />
        <Inputs
          type="text"
          style="w-full 
          border-2
          border-cyan-300
          h-8 rounded-xl
          text-gray-500 
          outline-cyan-300
          p-5
          placeholder:text-sm"
          id={"hometown"}
          labelOne="Hometown:"
          placeholder="Enter your hometown..."
          onChange={handleChange}
          value={hometown}
        />
        <div className="flex justify-start items-end gap-1">
          <Button
            buttonLabel={emitStatus === "Edit" ? "Update" : "Submit"}
            className="w-[50%] border p-2 
             rounded-xl text-white bg-cyan-400"
            loading={isLoading}
            disabled={
              firstname === "" ||
              lastname === "" ||
              (emitStatus === "" &&
                /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).{8,}$/.test(
                  password,
                ) === false) ||
              /^[\w-]+(\.[\w-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(
                email,
              ) === false
            }
            onClick={
              emitStatus === "Edit"
                ? handleEditOfMember
                : handleCreationOfMember
            }
          />
          <Button
            buttonLabel="Clear"
            className="w-[50%] border p-2 
             rounded-xl text-white bg-red-400"
            onClick={resetStates}
          />
        </div>
      </div>

      <div className="w-full p-2 flex justify-end">
        <Button
          buttonLabel="show table"
          className="w-fit border p-2 
             rounded-md text-white bg-cyan-700"
          onClick={handleClose}
        />
      </div>

      <BackgroundDialogue status={isShow} backgroundColor="bg-black">
        <div className="w-[70%] h-[600px] bg-white rounded-md mt-2 overflow-auto relative">
          <CloseDiagComp styles="flex justify-end" onClick={handleClose} />
          <div className="p-10 h-[500px]">
            <TableComponent
              headers={headers}
              items={props.listallMembers || []}
              renderCellContent={renderCellContent}
            />
          </div>
        </div>
      </BackgroundDialogue>
    </>
  );
};
