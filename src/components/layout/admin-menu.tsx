import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'

export const AdminMenu = () => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <HamburgerMenuIcon className='h-5 w-5' />

        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
