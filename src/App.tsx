import "./App.css";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { Sidebar } from "./layouts/sidebar";
import Header from "./layouts/header";

function App() {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <Sidebar
          chatTitles={["chat1", "chat2", "chat3"]}
          selectedChatIndex={0}
        />
        <SidebarInset>
          <Header />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default App;
