import {  useState } from "react";
import { SearchComp } from "../reusables/formcomponent/SearchComp";
// import { Select } from "../reusables/formcomponent/Select";
import Button from "../reusables/formcomponent/Button";
import { AccountSummary } from "../reusables/AccountSummary";
import { BackgroundDialogue } from "../reusables/BackgroundDialogue";
import { CloseDiagComp } from "../reusables/CloseDiagComp";
import { Inputs } from "../reusables/formcomponent/Inputs";
import { ErrorBlock } from "../reusables/ErrorBlock";
import { SuccessBlock } from "../reusables/SuccessBlock";
import axios from "axios";
import { Select } from "../reusables/formcomponent/Select";
import TableComponent from "../reusables/TableComponent";
import Dropdown from "../reusables/ActionComponent";
import * as XLSX from "xlsx";
// import { useNavigate } from "react-router-dom";

type Transaction = {
  id: number;
  date: string;
  name: string;
  amount: number;
  member: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
};

interface ListMembers {
  [x: string]: string | number;
  firtname: string;
  lastname: string;
  email: string;
  gender: string;
  children: number;
}

type Option = {
  id: string;
  name: string;
};

type Prop = {
  listallaccounts?: Transaction[];
  listallMembers?: ListMembers[];
  refetch?: () => void;
};

export const AccountComponent = (prop: Prop) => {
  // const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [successBlockStatus, setSuccessBlockStatus] = useState<boolean>(false);
  const [errorBlockStatus, setErrorBlockStatus] = useState<boolean>(false);
  const [blockMessage, setBlockMessage] = useState<string>("");
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [editState, setEditState] = useState<boolean>(false);
  const [update_id, setUpdate_id] = useState<number>(0);
  // const [selected, setSelected] = useState<string>("");

  const handlesearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchVal(value);
  };

  // Filter transactions based on search value
  const filteredTransactions = prop.listallaccounts?.filter((transaction) =>
    transaction.name.toLowerCase().includes(searchVal.toLowerCase()),
  );

  const contributions = prop.listallaccounts?.map((data) => data.amount);

  const totalamount = contributions?.reduce((cur, acc) => cur + acc, 0);

  // const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = event.target.value;
  //   setSelected(value);
  // };

  //handling exports here
  const handleExports = () => {
    if (filteredTransactions && filteredTransactions.length === 0) return;

    else if (filteredTransactions) {
      const flattenedData = filteredTransactions.map((transaction) => ({
        date: transaction.date,
        name: transaction.name,
        amount: transaction.amount,
        email: transaction.member.email,
      }));

      const worksheet = XLSX.utils.json_to_sheet(flattenedData);

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "EkissiFamily");

      const excelFileName = "EkissiFamily.xlsx";

      XLSX.writeFile(workbook, excelFileName);
    }
  };

  //populating the select field with data
  const parents: Option[] =
    prop?.listallMembers?.map((data) => ({
      id: data.id.toString(),
      name: `${data.firstname} ${data.lastname}`,
    })) || [];

  const handleSelectMember = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMember(value);
    const findmember = prop.listallMembers?.find(
      (mem) => mem.id === Number(value),
    );
    setName(`${findmember?.firstname} ${findmember?.lastname}`);
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
  };

  const handleIsopen = () => {
    setOpenDialog(!openDialog);
  };

  //create accout here
  const handleaccountCreattion = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/createaccount`,
        {
          memberid: selectedMember,
          date: date,
          name: name,
          amount: amount,
        },
      );

      if (response && response?.data?.status === true) {
        setSuccessBlockStatus(true);
        setBlockMessage(response?.data?.message);
        close();
        setTimeout(() => {
          setSuccessBlockStatus(false);
          prop.refetch && prop.refetch();
          setBlockMessage("");
        }, 3000);
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

  //handle update accounts here
  const handleupdateAccount = async () => {
    try {
      setIsLoading(true);

      const response = await axios.put(
        `${import.meta.env.VITE_ENDPOINT}/updateaccount`,
        {
          updateid: update_id,
          date: date,
          name: name,
          amount: amount,
        },
      );

      if (response && response?.data?.status === true) {
        setSuccessBlockStatus(true);
        setBlockMessage(response?.data?.message);
        close();
        setTimeout(() => {
          setSuccessBlockStatus(false);
          prop.refetch && prop.refetch();
          setBlockMessage("");
        }, 3000);
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

  //table codes down here
  const headers = [
    { key: "date", label: "Date" },
    { key: "name", label: "Name" },
    { key: "amount", label: "Amount" },
    { key: "email", label: "Email" },
    { key: "action", label: "Action" },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropDownId, setDropDownId] = useState<number>(0);
  const handleMouseClick = (param: number) => {
    setIsDropdownOpen(true);
    setDropDownId(param);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const renderCellContent = (headerKey: string, item: Record<string, any>) => {
    switch (headerKey) {
      case "date":
        return <div className="whitespace-nowrap">{item?.date}</div>;

      case "name":
        return <div className="whitespace-nowrap">{item?.name}</div>;

      case "amount":
        return <div className="whitespace-nowrap">{`GHC ${item?.amount}`}</div>;

      case "email":
        return <div className="whitespace-nowrap">{item?.member?.email}</div>;

      case "action":
        function emitAction(_id: string | number, _label: string): void {
          if (_label === "Edit" && prop.listallaccounts) {
            let memberfind = prop.listallaccounts.find(
              (data) => data.id === _id,
            );

            setUpdate_id(memberfind?.id || 0);
            setSelectedMember(String(memberfind?.member.id) || "");
            setAmount(String(memberfind?.amount) || "");
            setDate(memberfind?.date.toString().split("T")[0] || "");
            setEditState(true);

            setOpenDialog(true);
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

            <div className="absolute right-[98px]">
              {isDropdownOpen && dropDownId === item.id && (
                <Dropdown
                  onMouseLeave={handleMouseLeave}
                  dropdownItems={[
                    {
                      id: item.id,
                      image: "/images/editicon.svg",
                      label: "Edit",
                      dataCy: "edit",
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

  const close = () => {
    setOpenDialog(false);
    setSelectedMember("");
    setDate("");
    setAmount("");
    setEditState(false);
  };

  return (
    <div className="w-full h-[100%] p-4 overflow-auto">
      <SuccessBlock blockControl={successBlockStatus} message={blockMessage} />
      <ErrorBlock blockControl={errorBlockStatus} message={blockMessage} />
      <div className="w-full flex justify-between">
        <p className="font-bold text-xl">
          Family Account{" "}
          <span>({prop.listallaccounts && prop.listallaccounts.length})</span>
        </p>

        <div className="flex gap-1">
          <Button
            buttonLabel="Create Account"
            className="border p-2 
            rounded-md text-white bg-cyan-400"
            onClick={handleIsopen}
          />
          {/* <Button
            buttonLabel="Manage Account"
            className="border p-2 
             rounded-md text-white bg-cyan-700"
            onClick={() => navigate("/accountdetails")}
          /> */}
        </div>
      </div>

      <div className="w-full mt-4 text-end">
        <p className="font-bold text-md">Family Account Summary</p>
      </div>

      <div className="w-full h-[80px] mt-5">
        <AccountSummary
          logo={"/images/moneyone.svg"}
          figure={totalamount}
          label="Amount"
        />
      </div>

      <div className="w-full mt-5 flex justify-between">
        <div className="w-1/2 flex gap-2">
          <div className="w-[30%]">
            <SearchComp
              placeholder="Enter your search here"
              classStyle="ring-2 ring-cyan-500 p-2 rounded-xl border"
              handlesearch={handlesearch}
              value={searchVal}
            />
          </div>

          <div className="w-[30%] -mt-2 flex gap-2">
            {/* <p className="mt-4 ml-5">Filter</p>
            <Select
              placeholder="Select your status"
              style="w-full ring-2 ring-cyan-500 p-1.5 rounded-xl border"
              data={[
                { id: "1", name: "alive" },
                { id: "2", name: "deceased" },
              ]}
              onChange={handleSelect}
              value={selected}
            /> */}
          </div>
        </div>

        <div className="w-1/2 flex gap-2 justify-end">
          <Button
            logo="/images/export.svg"
            buttonLabel="Export Account"
            className="border p-2 rounded-md text-white bg-red-900"
            onClick={handleExports}
          />
        </div>
      </div>

      <div className="w-full h-[500px] mt-5 overflow-auto">
        {/*table rendering here..*/}
        <TableComponent
          headers={headers}
          items={filteredTransactions || []}
          renderCellContent={renderCellContent}
        />
      </div>

      {/* form to create account */}
      <div>
        <BackgroundDialogue status={openDialog} backgroundColor="bg-black">
          <div className="max-sm:w-[90%] md:w-[70%] xl:w-[30%] bg-white p-4 rounded">
            <CloseDiagComp styles="flex justify-end" onClick={handleIsopen} />

            <div className="w-full p-1 text-center">
              <p className="font-semibold text-xl">
                {editState ? "Edit Account" : "Create Account"}
              </p>
            </div>

            <div className="w-full flex mb-3">
              <Select
                placeholder="Select your status"
                style="w-full ring-2 text-gray-500  ring-cyan-300 p-1.5 rounded-xl border placeholder:text-sm"
                labelOne="Member"
                data={parents}
                value={selectedMember}
                onChange={handleSelectMember}
              />
            </div>

            <div className="w-full flex mb-3">
              <Inputs
                type="number"
                style="w-full 
                border-2
                border-cyan-300
                h-8 rounded-xl
                text-gray-500 
                outline-cyan-300
                p-5
                placeholder:text-sm
              "
                id={"amount"}
                labelOne="Amount:"
                placeholder="Enter your amount..."
                value={amount}
                onChange={handleChangeAmount}
              />
            </div>

            <div className="w-full flex mb-3">
              <Inputs
                type="date"
                style="w-full 
                border-2
                border-cyan-300
                h-8 rounded-xl
                text-gray-500 
                outline-cyan-300
                p-5
                placeholder:text-sm
              "
                id={"date"}
                labelOne="Date:"
                placeholder="Enter your date..."
                value={date}
                onChange={handleChangeDate}
              />
            </div>

            <div className="py-4">
              <Button
                buttonLabel={editState ? "Update" : "Create"}
                className="border w-full p-2 
                 rounded-xl text-white bg-cyan-400"
                loading={isloading}
                onClick={
                  editState ? handleupdateAccount : handleaccountCreattion
                }
              />
            </div>
          </div>
        </BackgroundDialogue>
      </div>
    </div>
  );
};
