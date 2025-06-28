import "./App.css";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "./components/ui/sidebar";
import Header from "./layouts/header";

function App() {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <Sidebar className="border-r" collapsible="offcanvas" />
        <SidebarInset>
          <Header />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default App;
