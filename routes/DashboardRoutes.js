// import { v4 as uuid } from 'uuid';
/**
 *  All Dashboard Routes
 *
 *  Understanding name/value pairs for Dashboard routes
 *
 *  Applicable for main/root/level 1 routes
 *  icon 		: String - It's only for main menu or you can consider 1st level menu item to specify icon name.
 *
 *  Applicable for main/root/level 1 and subitems routes
 * 	id 			: Number - You can use uuid() as value to generate unique ID using uuid library, you can also assign constant unique ID for react dynamic objects.
 *  title 		: String - If menu contains childern use title to provide main menu name.
 *  badge 		: String - (Optional - Default - '') If you specify badge value it will be displayed beside the menu title or menu item.
 * 	badgecolor 	: String - (Optional - Default - 'primary' ) - Used to specify badge background color.
 *
 *  Applicable for subitems / children items routes
 *  name 		: String - If it's menu item in which you are specifiying link, use name ( don't use title for that )
 *  children	: Array - Use to specify submenu items
 *
 *  Used to segrigate menu groups
 *  grouptitle : Boolean - (Optional - Default - false ) If you want to group menu items you can use grouptitle = true,
 *  ( Use title : value to specify group title  e.g. COMPONENTS , DOCUMENTATION that we did here. )
 *
 */





const rolename = 'admin';

// export const DashboardMenu = [
// 	{
// 		id: uuid(),
// 		title: 'Dashboard',
// 		icon: 'home',
// 		link: '/'
// 	},
// 	{
// 		id: uuid(),
// 		title: 'LAYOUTS & PAGES',
// 		grouptitle: true
// 	},
// 	...(rolename === 'admin'
// 		? [
// 			{
// 			  id: uuid(),
// 			  title: 'User Management',
// 			  icon: 'users',
// 			  children: [
// 				{ id: uuid(), link: '/pages/user/adduser', name: 'Add User' },
// 				{ id: uuid(), link: '/pages/user/viewalluser', name: 'View Users' }
// 			  ]
// 			}
// 		  ]
// 		: []),

// 	{
// 		id: uuid(),
// 		title: 'Role Management',
// 		icon: 'layers',
// 		children: [
// 			{ id: uuid(), link: '/pages/role/addrole', name: 'Add Role' },
// 			{ id: uuid(), link: '/pages/role/viewallrole', name: 'View Roles' },
// 		]
// 	},	
// 	{
// 		id: uuid(),
// 		title: 'Order Management',
// 		icon: 'layers',
// 		children: [
// 			{ id: uuid(), link: '/pages/order/addorder', name: 'Add Order' },
// 			{ id: uuid(), link: '/pages/order/viewallorder', name: 'View Order' },
// 		]
// 	},	
// 	{
// 		id: uuid(),
// 		title: 'Customer',
// 		icon: 'layers',
// 		children: [
// 			// { id: uuid(), link: '/pages/order/addorder', name: 'Add Order' },
// 			{ id: uuid(), link: '/pages/customer/viewcustomer', name: 'View Customer' },
// 		]
// 	},	
// 	{
// 		id: uuid(),
// 		title: 'Authentication',
// 		icon: 'lock',
// 		children: [
// 			{ id: uuid(), link: '/authentication/login', name: 'LogIn' },
// 			// { id: uuid(), link: '/authentication/sign-up', name: 'Sign Up' },
// 			// { id: uuid(), link: '/authentication/forget-password', name: 'Forget Password'}			
// 		]
// 	},
// 	// {
// 	// 	id: uuid(),
// 	// 	title: 'Layouts',
// 	// 	icon: 'layout',
// 	// 	link: '/layout-vertical'
// 	// },	
// 	{
// 		id: uuid(),
// 		title: 'UI COMPONENTS',
// 		grouptitle: true
// 	},	
// 	{
// 		id: uuid(),
// 		title: 'Components',
// 		icon: 'monitor',
// 		children: [
// 			{ id: uuid(), link: '/components/accordions', name: 'Accordions' },
// 			{ id: uuid(), link: '/components/alerts', name: 'Alerts' },
// 			{ id: uuid(), link: '/components/badges', name: 'Badges' },
// 			{ id: uuid(), link: '/components/breadcrumbs', name: 'Breadcrumbs' },
// 			{ id: uuid(), link: '/components/buttons', name: 'Buttons' },
// 			{ id: uuid(), link: '/components/button-group', name: 'ButtonGroup' },
// 			{ id: uuid(), link: '/components/cards', name: 'Cards' },
// 			{ id: uuid(), link: '/components/carousels', name: 'Carousel' },
// 			{ id: uuid(), link: '/components/close-button', name: 'Close Button' },
// 			{ id: uuid(), link: '/components/collapse', name: 'Collapse' },
// 			{ id: uuid(), link: '/components/dropdowns', name: 'Dropdowns' },
// 			{ id: uuid(), link: '/components/list-group', name: 'Listgroup' },
// 			{ id: uuid(), link: '/components/modal', name: 'Modal' },
// 			{ id: uuid(), link: '/components/navs', name: 'Navs' },
// 			{ id: uuid(), link: '/components/navbar', name: 'Navbar' },
// 			{ id: uuid(), link: '/components/offcanvas', name: 'Offcanvas' },
// 			{ id: uuid(), link: '/components/overlays', name: 'Overlays' },
// 			{ id: uuid(), link: '/components/pagination', name: 'Pagination' },
// 			{ id: uuid(), link: '/components/popovers', name: 'Popovers' },
// 			{ id: uuid(), link: '/components/progress', name: 'Progress' },
// 			{ id: uuid(), link: '/components/spinners', name: 'Spinners' },
// 			{ id: uuid(), link: '/components/tables', name: 'Tables' },
// 			{ id: uuid(), link: '/components/toasts', name: 'Toasts' },
// 			{ id: uuid(), link: '/components/tooltips', name: 'Tooltips' }
// 		]
// 	},	
// 	{
// 		id: uuid(),
// 		title: 'Menu Level',
// 		icon: 'corner-left-down',
// 		children: [
// 			{ 
// 				id: uuid(), 
// 				link: '#', 
// 				title: 'Two Level',
// 				children: [
// 					{ id: uuid(), link: '#', name: 'NavItem 1'},
// 					{ id: uuid(), link: '#', name: 'NavItem 2' }
// 				]
// 			},
// 			{ 
// 				id: uuid(), 
// 				link: '#', 
// 				title: 'Three Level',
// 				children: [
// 					{ 
// 						id: uuid(), 
// 						link: '#', 
// 						title: 'NavItem 1',
// 						children: [
// 							{ id: uuid(), link: '#', name: 'NavChildItem 1'},
// 							{ id: uuid(), link: '#', name: 'NavChildItem 2'}
// 						]
// 					},
// 					{ id: uuid(), link: '#', name: 'NavItem 2' }
// 				]
// 			}
// 		]
// 	},	
// 	// {
// 	// 	id: uuid(),
// 	// 	title: 'Documentation',
// 	// 	grouptitle: true
// 	// },
// 	// {
// 	// 	id: uuid(),
// 	// 	title: 'Docs',
// 	// 	icon: 'clipboard',
// 	// 	link: '/documentation'
// 	// },
// 	// {
// 	// 	id: uuid(),
// 	// 	title: 'Changelog',
// 	// 	icon: 'git-pull-request',
// 	// 	link: '/changelog'
// 	// },
// 	// {
// 	// 	id: uuid(),
// 	// 	title: 'Download',
// 	// 	icon: 'download',
// 	// 	link: 'https://codescandy.gumroad.com/l/dashui-nextjs'
// 	// }
// ];

// export default DashboardMenu;

// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { v4 as uuid } from 'uuid';


// const useDashboardMenu = () => {
//     const [dashboardMenu, setDashboardMenu] = useState([]);
//     const [permissions, setPermissions] = useState([]);

//     const filterMenu = (menuItems, permissionList) => {
//         // console.log("Filtering with permissions:", permissionList);

//         return menuItems
//             .map(item => {
//                 if (item.grouptitle) return item; // Keep group titles
//                 if (item.permission && !permissionList.includes(item.permission.toLowerCase())) return null;

//                 if (item.children) {
//                     const filteredChildren = item.children.filter(child =>
//                         child.permission ? permissionList.includes(child.permission.toLowerCase()) : true
//                     );
//                     return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null;
//                 }

//                 return item;
//             })
//             .filter(Boolean);
//     };

//     useEffect(() => {
//         const fetchPermissions = async () => {
//             try {
//                 const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/tokendecodeapi`);
//                 if (response.data && response.data.data) {
// 					// console.log(response.data.data);

// 					const permissionList = response.data.data.permissions.map(p => p._id);
// 					// console.log("Extracted Permission IDs:", permissionList);
// 					// setPermissions(permissionList);

//                     const menu = [
//                         {
// 							id: uuid(),
// 							title: 'Dashboard',
// 							icon: 'home',
// 							link: '/',
// 						},
// 						{
// 							id: uuid(),
// 							title: 'LAYOUTS & PAGES',
// 							grouptitle: true
// 						},
// 						...( 
//                             permissionList.includes('67b46c707b14d62c9c5850df') ||
//                             permissionList.includes('67b46c7d7b14d62c9c5850e1')
//                         ) ? [{
//                             id: uuid(),
//                             title: 'User Management',
//                             icon: 'users',
//                             children: [
//                                 ...(permissionList.includes('67b46c707b14d62c9c5850df') ? [
//                                     { id: uuid(), link: '/pages/user/adduser', name: 'Add User' }
//                                 ] : []),
//                                 ...(permissionList.includes('67b46c7d7b14d62c9c5850e1') ? [
//                                     { id: uuid(), link: '/pages/user/viewalluser', name: 'View Users' }
//                                 ] : [])
//                             ]
//                         }] : [],
// 						...( 
// 							permissionList.includes('67b46bf27b14d62c9c5850d7') || // addrole
// 							permissionList.includes('67b46c2e7b14d62c9c5850d9')    // viewroles
// 						) ? [{
// 							id: uuid(),
// 							title: 'Role Management',
// 							icon: 'layers',
// 							children: [
// 								...(permissionList.includes('67b46bf27b14d62c9c5850d7') ? [
// 									{ id: uuid(), link: '/pages/role/addrole', name: 'Add Role' }
// 								] : []),
// 								...(permissionList.includes('67b46c2e7b14d62c9c5850d9') ? [
// 									{ id: uuid(), link: '/pages/role/viewallrole', name: 'View Roles' }
// 								] : [])
// 							]
// 						}] : [],
// 						...( 
// 							permissionList.includes('67b46cc27b14d62c9c5850e7') || // addorder
// 							permissionList.includes('67b46cce7b14d62c9c5850e9')    // vieworders
// 						) ? [{
// 							id: uuid(),
// 							title: 'Order Management',
// 							icon: 'layers',
// 							children: [
// 								...(permissionList.includes('67b46cc27b14d62c9c5850e7') ? [
// 									{ id: uuid(), link: '/pages/order/addorder', name: 'Add Order' }
// 								] : []),
// 								...(permissionList.includes('67b46cce7b14d62c9c5850e9') ? [
// 									{ id: uuid(), link: '/pages/order/viewallorder', name: 'View Order' }
// 								] : [])
// 							]
// 						}] : [],	
// 						...( 
// 							permissionList.includes('67b70a4f2a60496e39c85761') // viewusers
// 						) ? [{
// 							id: uuid(),
// 							title: 'Customer',
// 							icon: 'layers',
// 							children: [
// 								...(permissionList.includes('67b70a4f2a60496e39c85761') ? [
// 									{ id: uuid(), link: '/pages/customer/viewcustomer', name: 'View Customer' }
// 								] : [])
// 							]
// 						}] : [],
// 						// {
// 						// 	id: uuid(),
// 						// 	title: 'Authentication',
// 						// 	icon: 'lock',
// 						// 	children: [
// 						// 		{ id: uuid(), link: '/authentication/login', name: 'LogIn' },
// 						// 		// { id: uuid(), link: '/authentication/sign-up', name: 'Sign Up' },
// 						// 		// { id: uuid(), link: '/authentication/forget-password', name: 'Forget Password'}			
// 						// 	]
// 						// },
// 						// {
// 						// 	id: uuid(),
// 						// 	title: 'Layouts',
// 						// 	icon: 'layout',
// 						// 	link: '/layout-vertical'
// 						// },	
// 						{
// 							id: uuid(),
// 							title: 'UI COMPONENTS',
// 							grouptitle: true
// 						},	
// 						{
// 							id: uuid(),
// 							title: 'Components',
// 							icon: 'monitor',
// 							children: [
// 								{ id: uuid(), link: '/components/accordions', name: 'Accordions' },
// 								{ id: uuid(), link: '/components/alerts', name: 'Alerts' },
// 								{ id: uuid(), link: '/components/badges', name: 'Badges' },
// 								{ id: uuid(), link: '/components/breadcrumbs', name: 'Breadcrumbs' },
// 								{ id: uuid(), link: '/components/buttons', name: 'Buttons' },
// 								{ id: uuid(), link: '/components/button-group', name: 'ButtonGroup' },
// 								{ id: uuid(), link: '/components/cards', name: 'Cards' },
// 								{ id: uuid(), link: '/components/carousels', name: 'Carousel' },
// 								{ id: uuid(), link: '/components/close-button', name: 'Close Button' },
// 								{ id: uuid(), link: '/components/collapse', name: 'Collapse' },
// 								{ id: uuid(), link: '/components/dropdowns', name: 'Dropdowns' },
// 								{ id: uuid(), link: '/components/list-group', name: 'Listgroup' },
// 								{ id: uuid(), link: '/components/modal', name: 'Modal' },
// 								{ id: uuid(), link: '/components/navs', name: 'Navs' },
// 								{ id: uuid(), link: '/components/navbar', name: 'Navbar' },
// 								{ id: uuid(), link: '/components/offcanvas', name: 'Offcanvas' },
// 								{ id: uuid(), link: '/components/overlays', name: 'Overlays' },
// 								{ id: uuid(), link: '/components/pagination', name: 'Pagination' },
// 								{ id: uuid(), link: '/components/popovers', name: 'Popovers' },
// 								{ id: uuid(), link: '/components/progress', name: 'Progress' },
// 								{ id: uuid(), link: '/components/spinners', name: 'Spinners' },
// 								{ id: uuid(), link: '/components/tables', name: 'Tables' },
// 								{ id: uuid(), link: '/components/toasts', name: 'Toasts' },
// 								{ id: uuid(), link: '/components/tooltips', name: 'Tooltips' }
// 							]
// 						},	
// 						{
// 							id: uuid(),
// 							title: 'Menu Level',
// 							icon: 'corner-left-down',
// 							children: [
// 								{ 
// 									id: uuid(), 
// 									link: '#', 
// 									title: 'Two Level',
// 									children: [
// 										{ id: uuid(), link: '#', name: 'NavItem 1'},
// 										{ id: uuid(), link: '#', name: 'NavItem 2' }
// 									]
// 								},
// 								{ 
// 									id: uuid(), 
// 									link: '#', 
// 									title: 'Three Level',
// 									children: [
// 										{ 
// 											id: uuid(), 
// 											link: '#', 
// 											title: 'NavItem 1',
// 											children: [
// 												{ id: uuid(), link: '#', name: 'NavChildItem 1'},
// 												{ id: uuid(), link: '#', name: 'NavChildItem 2'}
// 											]
// 										},
// 										{ id: uuid(), link: '#', name: 'NavItem 2' }
// 									]
// 								}
// 							]
// 						},	
//                     ];

//                     const filteredMenu = filterMenu(menu, permissionList);
//                     // console.log("Filtered Menu:", filteredMenu);
//                     setDashboardMenu(filteredMenu); // Set filtered menu
//                 } else {
//                     console.error("Unexpected API Response:", response.data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };
//         fetchPermissions();
//     }, []);

//     return dashboardMenu;
// };

// export default useDashboardMenu;





import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid"; // Ensure UUID import

const useDashboardMenu = () => {
  const [dashboardMenu, setDashboardMenu] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const filterMenu = useCallback((menuItems, permissionList) => {
    return menuItems
      .map(item => {
        if (item.grouptitle) return item; // Keep group titles
        if (item.permission && !permissionList.includes(item.permission.toLowerCase())) return null;

        if (item.children) {
          const filteredChildren = item.children.filter(child =>
            child.permission ? permissionList.includes(child.permission.toLowerCase()) : true
          );
          return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null;
        }

        return item;
      })
      .filter(Boolean);
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/tokendecodeapi`);
      if (response.data?.data) {
        const permissionList = response.data.data.permissions.map(p => p._id);
        setPermissions(permissionList);

        const menu = [
          { id: uuid(), title: "Dashboard", icon: "home", link: "/" },
          { id: uuid(), title: "LAYOUTS & PAGES", grouptitle: true },

          ...(permissionList.includes("67b46c707b14d62c9c5850df") || permissionList.includes("67b46c7d7b14d62c9c5850e1")
            ? [
                {
                  id: uuid(),
                  title: "User Management",
                  icon: "users",
                  children: [
                    ...(permissionList.includes("67b46c707b14d62c9c5850df")
                      ? [{ id: uuid(), link: "/pages/user/adduser", name: "Add User" }]
                      : []),
                    ...(permissionList.includes("67b46c7d7b14d62c9c5850e1")
                      ? [{ id: uuid(), link: "/pages/user/viewalluser", name: "View Users" }]
                      : []),
                  ],
                },
              ]
            : []),

          ...(permissionList.includes("67b46bf27b14d62c9c5850d7") || permissionList.includes("67b46c2e7b14d62c9c5850d9")
            ? [
                {
                  id: uuid(),
                  title: "Role Management",
                  icon: "layers",
                  children: [
                    ...(permissionList.includes("67b46bf27b14d62c9c5850d7")
                      ? [{ id: uuid(), link: "/pages/role/addrole", name: "Add Role" }]
                      : []),
                    ...(permissionList.includes("67b46c2e7b14d62c9c5850d9")
                      ? [{ id: uuid(), link: "/pages/role/viewallrole", name: "View Roles" }]
                      : []),
                  ],
                },
              ]
            : []),

          ...(permissionList.includes("67b46cc27b14d62c9c5850e7") || permissionList.includes("67b46cce7b14d62c9c5850e9")
            ? [
                {
                  id: uuid(),
                  title: "Order Management",
                  icon: "layers",
                  children: [
                    ...(permissionList.includes("67b46cc27b14d62c9c5850e7")
                      ? [{ id: uuid(), link: "/pages/order/addorder", name: "Add Order" }]
                      : []),
                    ...(permissionList.includes("67b46cce7b14d62c9c5850e9")
                      ? [{ id: uuid(), link: "/pages/order/viewallorder", name: "View Order" }]
                      : []),
                  ],
                },
              ]
            : []),

          ...(permissionList.includes("67b70a4f2a60496e39c85761")
            ? [
                {
                  id: uuid(),
                  title: "Customer",
                  icon: "layers",
                  children: [
                    ...(permissionList.includes("67b70a4f2a60496e39c85761")
                      ? [{ id: uuid(), link: "/pages/customer/viewcustomer", name: "View Customer" }]
                      : []),
                  ],
                },
              ]
            : []),
          {
            id: uuid(),
            title: 'Analytics',
            icon: 'layers',
            children: [
              { id: uuid(), link: '/pages/analytics/viewTotalSale', name: 'Sale Summary' },
              // { id: uuid(), link: '/pages/analytics/viewTotalOrders', name: 'Order Totals' },
            ]
          },
          { id: uuid(), title: "UI COMPONENTS", grouptitle: true },
          {
            id: uuid(),
            title: "Components",
            icon: "monitor",
            children: [
              { id: uuid(), link: "/components/accordions", name: "Accordions" },
              { id: uuid(), link: "/components/alerts", name: "Alerts" },
              { id: uuid(), link: "/components/badges", name: "Badges" },
              { id: uuid(), link: "/components/breadcrumbs", name: "Breadcrumbs" },
              { id: uuid(), link: "/components/buttons", name: "Buttons" },
              { id: uuid(), link: "/components/button-group", name: "ButtonGroup" },
              { id: uuid(), link: "/components/cards", name: "Cards" },
              { id: uuid(), link: "/components/carousels", name: "Carousel" },
              { id: uuid(), link: "/components/close-button", name: "Close Button" },
              { id: uuid(), link: "/components/collapse", name: "Collapse" },
              { id: uuid(), link: "/components/dropdowns", name: "Dropdowns" },
              { id: uuid(), link: "/components/list-group", name: "Listgroup" },
              { id: uuid(), link: "/components/modal", name: "Modal" },
              { id: uuid(), link: "/components/navs", name: "Navs" },
              { id: uuid(), link: "/components/navbar", name: "Navbar" },
              { id: uuid(), link: "/components/offcanvas", name: "Offcanvas" },
              { id: uuid(), link: "/components/overlays", name: "Overlays" },
              { id: uuid(), link: "/components/pagination", name: "Pagination" },
              { id: uuid(), link: "/components/popovers", name: "Popovers" },
              { id: uuid(), link: "/components/progress", name: "Progress" },
              { id: uuid(), link: "/components/spinners", name: "Spinners" },
              { id: uuid(), link: "/components/tables", name: "Tables" },
              { id: uuid(), link: "/components/toasts", name: "Toasts" },
              { id: uuid(), link: "/components/tooltips", name: "Tooltips" },
            ],
          },
        ];

        const filteredMenu = filterMenu(menu, permissionList);
        setDashboardMenu(filteredMenu);
      } else {
        console.error("Unexpected API Response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [filterMenu]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return dashboardMenu;
};

export default useDashboardMenu;
