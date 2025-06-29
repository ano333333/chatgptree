import { Sidebar } from "@/layouts/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/internal/actions";

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
            chatTitles={["chat1", "chat2", "chat3"]}
            selectedChatIndex={0}
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
              chatTitles={Array.from({ length: 20 }, (_, i) => `chat${i + 1}`)}
              selectedChatIndex={0}
            />
          </SidebarInset>
        </SidebarProvider>
      </>
    );
  },
};
