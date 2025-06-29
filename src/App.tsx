import "./App.css";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { Sidebar } from "./layouts/sidebar";
import Header from "./layouts/header";
import Body from "./layouts/body";

function App() {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <Sidebar
          chats={[
            { id: "chat1", title: "chat1" },
            { id: "chat2", title: "chat2" },
            { id: "chat3", title: "chat3" },
          ]}
          selectedChatId="chat1"
        />
        <SidebarInset>
          <Header />
          <Body />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default App;
