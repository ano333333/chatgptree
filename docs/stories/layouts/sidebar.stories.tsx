import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/layouts/sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Layouts/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SidebarStory: Story = {
  render: () => (
    <>
      <SidebarProvider>
        <SidebarInset>
          <Sidebar
            chats={[
              { id: "chat1", title: "chat1" },
              { id: "chat2", title: "chat2" },
              { id: "chat3", title: "chat3" },
            ]}
            selectedChatId="chat1"
            onClickNewChat={action("onClickNewChat")}
            onClickChat={action("onClickChat")}
          />
        </SidebarInset>
      </SidebarProvider>
    </>
  ),
};

export const SidebarWithManyItemsStory: Story = {
  render: () => {
    return (
      <>
        <SidebarProvider>
          <SidebarInset>
            <Sidebar
              chats={Array.from({ length: 20 }, (_, i) => ({
                id: `chat${i + 1}`,
                title: `chat${i + 1}`,
              }))}
              selectedChatId="chat1"
            />
          </SidebarInset>
        </SidebarProvider>
      </>
    );
  },
};
