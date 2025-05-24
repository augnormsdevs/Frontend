interface Props {
  selectedApp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  show?: boolean;
  accesslevelname?:string;
}

export const AppsComponent = (props: Props) => {
  const { selectedApp, accesslevelname } = props;
  console.log(accesslevelname)
  return (
    <div
      className="
     w-[25%] h-[200px] 
     rounded-md p-2 shadow-lg 
     fixed top-20 right-28 z-10
     bg-white grid grid-cols-4 
     grid-rows-3 gap-1 overflow-auto
     "
      style={{
        position: "fixed",
        right: props.show ? "112px" : "-510px",
        transition: "right 0.3s ease",
      }}
    >
      <div
        id="dashboard"
        onClick={selectedApp}
        className="w-full shadow-md rounded cursor-pointer item-center p-2 hover:bg-cyan-200 hover:text-white"
      >
        <img
          id="dashboard"
          onClick={selectedApp}
          src="/images/dashboardIcon.svg"
          alt="dashboard-icon"
        />
        <p className="text-xs">Dashboard</p>
      </div>

      <div
        id="heirarchy"
        onClick={selectedApp}
        className="w-full shadow-md rounded cursor-pointer item-center p-2 hover:bg-cyan-200 hover:text-white"
      >
        <img
          id="heirarchy"
          onClick={selectedApp}
          src="/images/heirarchy.svg"
          alt="heirarchy-icon"
        />
        <p className="text-xs">Heirarchy</p>
      </div>

      <div
        id="Accounts"
        onClick={selectedApp}
        className="w-full shadow-md rounded cursor-pointer item-center p-2 hover:bg-cyan-200 hover:text-white"
      >
        <img
          id="Accounts"
          onClick={selectedApp}
          src="/images/Accounts.svg"
          alt="Accounts-icon"
        />
        <p className="text-xs">Accounts</p>
      </div>

      <div
        id="Members"
        onClick={selectedApp}
        className="w-full shadow-md rounded cursor-pointer item-center p-2 hover:bg-cyan-200 hover:text-white"
      >
        <img
          id="Members"
          onClick={selectedApp}
          src="/images/group.svg"
          alt="Members-icon"
        />
        <p className="text-xs">Members</p>
      </div>

      {accesslevelname === "Admin" && <div
        id="settings"
        onClick={selectedApp}
        className="w-full shadow-md rounded cursor-pointer item-center p-2 hover:bg-cyan-200 hover:text-white"
      >
        <img
          id="settings"
          onClick={selectedApp}
          src="/images/settings.svg"
          alt="settings-icon"
        />
        <p className="text-xs">Settings</p>
      </div>}
    </div>
  );
};
