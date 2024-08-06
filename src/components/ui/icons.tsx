import { LucideIcon, LucideProps, User } from "lucide-react"
export type IconProps = React.HTMLAttributes<SVGElement>

export type Icon = LucideIcon

export const Icons = {
  user: User,
  google: ({ ...props }: LucideProps) => (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1330_1928)">
        <path
          d="M24.2663 12.2763C24.2663 11.4605 24.2001 10.6404 24.059 9.83789H12.7402V14.4589H19.222C18.953 15.9492 18.0888 17.2676 16.8233 18.1054V21.1037H20.6903C22.9611 19.0137 24.2663 15.9272 24.2663 12.2763Z"
          fill="#4285F4"
        />
        <path
          d="M12.7401 24.0013C15.9766 24.0013 18.7059 22.9387 20.6945 21.1044L16.8276 18.106C15.7517 18.838 14.3627 19.2525 12.7445 19.2525C9.61388 19.2525 6.95946 17.1404 6.00705 14.3008H2.0166V17.3917C4.05371 21.4439 8.2029 24.0013 12.7401 24.0013Z"
          fill="#34A853"
        />
        <path
          d="M6.00277 14.3007C5.50011 12.8103 5.50011 11.1965 6.00277 9.70618V6.61523H2.01674C0.314734 10.006 0.314734 14.0009 2.01674 17.3916L6.00277 14.3007Z"
          fill="#FBBC04"
        />
        <path
          d="M12.7401 4.74966C14.4509 4.7232 16.1044 5.36697 17.3434 6.54867L20.7695 3.12262C18.6001 1.0855 15.7208 -0.034466 12.7401 0.000808666C8.2029 0.000808666 4.05371 2.55822 2.0166 6.61481L6.00264 9.70575C6.95064 6.86173 9.60947 4.74966 12.7401 4.74966Z"
          fill="#EA4335"
        />
      </g>
      <defs>
        <clipPath id="clip0_1330_1928">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  alertSuccess: (props: IconProps) => (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="0.3">
        <path
          d="M6 19C6 11.8203 11.8203 6 19 6C26.1797 6 32 11.8203 32 19C32 26.1797 26.1797 32 19 32C11.8203 32 6 26.1797 6 19Z"
          stroke="#079455"
          strokeWidth="2"
        />
      </g>
      <g opacity="0.1">
        <path
          d="M1 19C1 9.05888 9.05888 1 19 1C28.9411 1 37 9.05888 37 19C37 28.9411 28.9411 37 19 37C9.05888 37 1 28.9411 1 19Z"
          stroke="#079455"
          strokeWidth="2"
        />
      </g>
      <g clipPath="url(#clip0_170_197213)">
        <path
          d="M15.2503 19.0003L17.7503 21.5003L22.7503 16.5003M27.3337 19.0003C27.3337 23.6027 23.6027 27.3337 19.0003 27.3337C14.398 27.3337 10.667 23.6027 10.667 19.0003C10.667 14.398 14.398 10.667 19.0003 10.667C23.6027 10.667 27.3337 14.398 27.3337 19.0003Z"
          stroke="#079455"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_170_197213">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(9 9)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  alertError: (props: IconProps) => (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="0.3">
        <path
          d="M18.0001 30.5C11.0965 30.5 5.50008 24.9035 5.50008 18C5.50008 11.0964 11.0965 5.49996 18.0001 5.49996C24.9036 5.49996 30.5001 11.0964 30.5001 18C30.5001 24.9035 24.9036 30.5 18.0001 30.5Z"
          stroke="#D92D20"
          strokeWidth="1.66667"
        />
      </g>
      <g opacity="0.1">
        <path
          d="M17.1667 1.33333H18.8333C27.5778 1.33333 34.6667 8.42216 34.6667 17.1667V18.8333C34.6667 27.5778 27.5778 34.6667 18.8333 34.6667H17.1667C8.42216 34.6667 1.33333 27.5778 1.33333 18.8333V17.1667C1.33333 8.42216 8.42216 1.33333 17.1667 1.33333Z"
          stroke="#D92D20"
          strokeWidth="1.66667"
        />
      </g>
      <g clipPath="url(#clip0_1130_82861)">
        <path
          d="M18.0001 14.6666V18M18.0001 21.3333H18.0084M26.3334 18C26.3334 22.6023 22.6025 26.3333 18.0001 26.3333C13.3977 26.3333 9.66675 22.6023 9.66675 18C9.66675 13.3976 13.3977 9.66663 18.0001 9.66663C22.6025 9.66663 26.3334 13.3976 26.3334 18Z"
          stroke="#D92D20"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1130_82861">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(8 8)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  route: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M11.5 5H11.9344C14.9816 5 16.5053 5 17.0836 5.54729C17.5836 6.02037 17.8051 6.71728 17.6702 7.39221C17.514 8.17302 16.2701 9.05285 13.7823 10.8125L9.71772 13.6875C7.2299 15.4471 5.98599 16.327 5.82984 17.1078C5.69486 17.7827 5.91642 18.4796 6.41636 18.9527C6.99474 19.5 8.51836 19.5 11.5656 19.5H12.5M8 5C8 6.65685 6.65685 8 5 8C3.34315 8 2 6.65685 2 5C2 3.34315 3.34315 2 5 2C6.65685 2 8 3.34315 8 5ZM22 19C22 20.6569 20.6569 22 19 22C17.3431 22 16 20.6569 16 19C16 17.3431 17.3431 16 19 16C20.6569 16 22 17.3431 22 19Z"
        stroke="#667085"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  arrowSquare: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M12 8L8 12M8 12L12 16M8 12H16M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
        stroke="#667085"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  pdfIcon: (props: IconProps) => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 4C4 1.79086 5.79086 0 8 0H24L36 12V36C36 38.2091 34.2091 40 32 40H8C5.79086 40 4 38.2091 4 36V4Z"
        fill="#D92D20"
      />
      <path
        opacity="0.3"
        d="M24 0L36 12H28C25.7909 12 24 10.2091 24 8V0Z"
        fill="white"
      />
      <path
        d="M11.7491 32V25.4545H14.3315C14.8279 25.4545 15.2508 25.5494 15.6003 25.739C15.9497 25.9265 16.216 26.1875 16.3993 26.522C16.5847 26.8544 16.6773 27.2379 16.6773 27.6726C16.6773 28.1072 16.5836 28.4908 16.3961 28.8232C16.2086 29.1555 15.9369 29.4144 15.5811 29.5998C15.2274 29.7852 14.7991 29.8778 14.2963 29.8778H12.6503V28.7688H14.0726C14.3389 28.7688 14.5584 28.723 14.731 28.6314C14.9057 28.5376 15.0356 28.4087 15.1209 28.2447C15.2082 28.0785 15.2519 27.8878 15.2519 27.6726C15.2519 27.4553 15.2082 27.2656 15.1209 27.1037C15.0356 26.9396 14.9057 26.8129 14.731 26.7234C14.5562 26.6317 14.3347 26.5859 14.0662 26.5859H13.1329V32H11.7491ZM19.8965 32H17.5762V25.4545H19.9157C20.5741 25.4545 21.1408 25.5856 21.616 25.8477C22.0911 26.1076 22.4565 26.4815 22.7122 26.9695C22.97 27.4574 23.0989 28.0412 23.0989 28.7209C23.0989 29.4027 22.97 29.9886 22.7122 30.4787C22.4565 30.9687 22.089 31.3448 21.6096 31.6069C21.1323 31.869 20.5613 32 19.8965 32ZM18.9601 30.8143H19.839C20.2481 30.8143 20.5922 30.7418 20.8713 30.5969C21.1526 30.4499 21.3635 30.223 21.5041 29.9162C21.6469 29.6072 21.7183 29.2088 21.7183 28.7209C21.7183 28.2372 21.6469 27.842 21.5041 27.5352C21.3635 27.2283 21.1536 27.0025 20.8745 26.8576C20.5954 26.7127 20.2513 26.6403 19.8422 26.6403H18.9601V30.8143ZM24.1241 32V25.4545H28.4579V26.5955H25.5079V28.1552H28.1702V29.2962H25.5079V32H24.1241Z"
        fill="white"
      />
    </svg>
  ),
  lineChart: (props: IconProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V3M20 8L16.0811 12.1827C15.9326 12.3412 15.8584 12.4204 15.7688 12.4614C15.6897 12.4976 15.6026 12.5125 15.516 12.5047C15.4179 12.4958 15.3215 12.4458 15.1287 12.3457L11.8713 10.6543C11.6785 10.5542 11.5821 10.5042 11.484 10.4953C11.3974 10.4875 11.3103 10.5024 11.2312 10.5386C11.1416 10.5796 11.0674 10.6588 10.9189 10.8173L7 15" />
    </svg>
  ),
  folderCheck: (props: IconProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7ZM9 14L11 16L15.5 11.5" />
    </svg>
  ),
  messageChatCircle: (props: IconProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6.09436 11.2288C6.03221 10.8282 5.99996 10.4179 5.99996 10C5.99996 5.58172 9.60525 2 14.0526 2C18.4999 2 22.1052 5.58172 22.1052 10C22.1052 10.9981 21.9213 11.9535 21.5852 12.8345C21.5154 13.0175 21.4804 13.109 21.4646 13.1804C21.4489 13.2512 21.4428 13.301 21.4411 13.3735C21.4394 13.4466 21.4493 13.5272 21.4692 13.6883L21.8717 16.9585C21.9153 17.3125 21.9371 17.4895 21.8782 17.6182C21.8266 17.731 21.735 17.8205 21.6211 17.8695C21.4911 17.9254 21.3146 17.8995 20.9617 17.8478L17.7765 17.3809C17.6101 17.3565 17.527 17.3443 17.4512 17.3448C17.3763 17.3452 17.3245 17.3507 17.2511 17.3661C17.177 17.3817 17.0823 17.4172 16.893 17.4881C16.0097 17.819 15.0524 18 14.0526 18C13.6344 18 13.2237 17.9683 12.8227 17.9073M7.63158 22C10.5965 22 13 19.5376 13 16.5C13 13.4624 10.5965 11 7.63158 11C4.66668 11 2.26316 13.4624 2.26316 16.5C2.26316 17.1106 2.36028 17.6979 2.53955 18.2467C2.61533 18.4787 2.65322 18.5947 2.66566 18.6739C2.67864 18.7567 2.68091 18.8031 2.67608 18.8867C2.67145 18.9668 2.65141 19.0573 2.61134 19.2383L2 22L4.9948 21.591C5.15827 21.5687 5.24 21.5575 5.31137 21.558C5.38652 21.5585 5.42641 21.5626 5.50011 21.5773C5.5701 21.5912 5.67416 21.6279 5.88227 21.7014C6.43059 21.8949 7.01911 22 7.63158 22Z" />
    </svg>
  ),
  setting: (props: IconProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
      <path d="M18.7273 14.7273C18.6063 15.0015 18.5702 15.3056 18.6236 15.6005C18.6771 15.8954 18.8177 16.1676 19.0273 16.3818L19.0818 16.4364C19.2509 16.6052 19.385 16.8057 19.4765 17.0265C19.568 17.2472 19.6151 17.4838 19.6151 17.7227C19.6151 17.9617 19.568 18.1983 19.4765 18.419C19.385 18.6397 19.2509 18.8402 19.0818 19.0091C18.913 19.1781 18.7124 19.3122 18.4917 19.4037C18.271 19.4952 18.0344 19.5423 17.7955 19.5423C17.5565 19.5423 17.3199 19.4952 17.0992 19.4037C16.8785 19.3122 16.678 19.1781 16.5091 19.0091L16.4545 18.9545C16.2403 18.745 15.9682 18.6044 15.6733 18.5509C15.3784 18.4974 15.0742 18.5335 14.8 18.6545C14.5311 18.7698 14.3018 18.9611 14.1403 19.205C13.9788 19.4489 13.8921 19.7347 13.8909 20.0273V20.1818C13.8909 20.664 13.6994 21.1265 13.3584 21.4675C13.0174 21.8084 12.5549 22 12.0727 22C11.5905 22 11.1281 21.8084 10.7871 21.4675C10.4461 21.1265 10.2545 20.664 10.2545 20.1818V20.1C10.2475 19.7991 10.1501 19.5073 9.97501 19.2625C9.79991 19.0176 9.55521 18.8312 9.27273 18.7273C8.99853 18.6063 8.69437 18.5702 8.39947 18.6236C8.10456 18.6771 7.83244 18.8177 7.61818 19.0273L7.56364 19.0818C7.39478 19.2509 7.19425 19.385 6.97353 19.4765C6.7528 19.568 6.51621 19.6151 6.27727 19.6151C6.03834 19.6151 5.80174 19.568 5.58102 19.4765C5.36029 19.385 5.15977 19.2509 4.99091 19.0818C4.82186 18.913 4.68775 18.7124 4.59626 18.4917C4.50476 18.271 4.45766 18.0344 4.45766 17.7955C4.45766 17.5565 4.50476 17.3199 4.59626 17.0992C4.68775 16.8785 4.82186 16.678 4.99091 16.5091L5.04545 16.4545C5.25503 16.2403 5.39562 15.9682 5.4491 15.6733C5.50257 15.3784 5.46647 15.0742 5.34545 14.8C5.23022 14.5311 5.03887 14.3018 4.79497 14.1403C4.55107 13.9788 4.26526 13.8921 3.97273 13.8909H3.81818C3.33597 13.8909 2.87351 13.6994 2.53253 13.3584C2.19156 13.0174 2 12.5549 2 12.0727C2 11.5905 2.19156 11.1281 2.53253 10.7871C2.87351 10.4461 3.33597 10.2545 3.81818 10.2545H3.9C4.2009 10.2475 4.49273 10.1501 4.73754 9.97501C4.98236 9.79991 5.16883 9.55521 5.27273 9.27273C5.39374 8.99853 5.42984 8.69437 5.37637 8.39947C5.3229 8.10456 5.18231 7.83244 4.97273 7.61818L4.91818 7.56364C4.74913 7.39478 4.61503 7.19425 4.52353 6.97353C4.43203 6.7528 4.38493 6.51621 4.38493 6.27727C4.38493 6.03834 4.43203 5.80174 4.52353 5.58102C4.61503 5.36029 4.74913 5.15977 4.91818 4.99091C5.08704 4.82186 5.28757 4.68775 5.50829 4.59626C5.72901 4.50476 5.96561 4.45766 6.20455 4.45766C6.44348 4.45766 6.68008 4.50476 6.9008 4.59626C7.12152 4.68775 7.32205 4.82186 7.49091 4.99091L7.54545 5.04545C7.75971 5.25503 8.03183 5.39562 8.32674 5.4491C8.62164 5.50257 8.9258 5.46647 9.2 5.34545H9.27273C9.54161 5.23022 9.77093 5.03887 9.93245 4.79497C10.094 4.55107 10.1807 4.26526 10.1818 3.97273V3.81818C10.1818 3.33597 10.3734 2.87351 10.7144 2.53253C11.0553 2.19156 11.5178 2 12 2C12.4822 2 12.9447 2.19156 13.2856 2.53253C13.6266 2.87351 13.8182 3.33597 13.8182 3.81818V3.9C13.8193 4.19253 13.906 4.47834 14.0676 4.72224C14.2291 4.96614 14.4584 5.15749 14.7273 5.27273C15.0015 5.39374 15.3056 5.42984 15.6005 5.37637C15.8954 5.3229 16.1676 5.18231 16.3818 4.97273L16.4364 4.91818C16.6052 4.74913 16.8057 4.61503 17.0265 4.52353C17.2472 4.43203 17.4838 4.38493 17.7227 4.38493C17.9617 4.38493 18.1983 4.43203 18.419 4.52353C18.6397 4.61503 18.8402 4.74913 19.0091 4.91818C19.1781 5.08704 19.3122 5.28757 19.4037 5.50829C19.4952 5.72901 19.5423 5.96561 19.5423 6.20455C19.5423 6.44348 19.4952 6.68008 19.4037 6.9008C19.3122 7.12152 19.1781 7.32205 19.0091 7.49091L18.9545 7.54545C18.745 7.75971 18.6044 8.03183 18.5509 8.32674C18.4974 8.62164 18.5335 8.9258 18.6545 9.2V9.27273C18.7698 9.54161 18.9611 9.77093 19.205 9.93245C19.4489 10.094 19.7347 10.1807 20.0273 10.1818H20.1818C20.664 10.1818 21.1265 10.3734 21.4675 10.7144C21.8084 11.0553 22 11.5178 22 12C22 12.4822 21.8084 12.9447 21.4675 13.2856C21.1265 13.6266 20.664 13.8182 20.1818 13.8182H20.1C19.8075 13.8193 19.5217 13.906 19.2778 14.0676C19.0339 14.2291 18.8425 14.4584 18.7273 14.7273Z" />
    </svg>
  ),
  home: (props: IconProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 17H16M11.0177 2.76401L4.23539 8.03914C3.78202 8.39176 3.55534 8.56807 3.39203 8.78887C3.24737 8.98446 3.1396 9.2048 3.07403 9.43907C3 9.70353 3 9.99071 3 10.5651V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V10.5651C21 9.99071 21 9.70353 20.926 9.43907C20.8604 9.2048 20.7526 8.98446 20.608 8.78887C20.4447 8.56807 20.218 8.39176 19.7646 8.03914L12.9823 2.76401C12.631 2.49076 12.4553 2.35413 12.2613 2.30162C12.0902 2.25528 11.9098 2.25528 11.7387 2.30162C11.5447 2.35413 11.369 2.49076 11.0177 2.76401Z" />
    </svg>
  ),
  greenCheckCircle: (props: IconProps) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z"
        fill="#F3FEE7"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.2464 6.15838L8.27969 11.9167L6.69635 10.2251C6.40469 9.95005 5.94635 9.93338 5.61302 10.1667C5.28802 10.4084 5.19635 10.8334 5.39635 11.1751L7.27135 14.2251C7.45469 14.5084 7.77135 14.6834 8.12969 14.6834C8.47135 14.6834 8.79635 14.5084 8.97969 14.2251C9.27969 13.8334 15.0047 7.00838 15.0047 7.00838C15.7547 6.24172 14.8464 5.56672 14.2464 6.15005V6.15838Z"
        fill="#4CA30D"
      />
    </svg>
  ),
  notificationSuccess: (props: IconProps) => (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="0.3">
        <path
          d="M6 19C6 11.8203 11.8203 6 19 6C26.1797 6 32 11.8203 32 19C32 26.1797 26.1797 32 19 32C11.8203 32 6 26.1797 6 19Z"
          stroke="#079455"
          strokeWidth="2"
        />
      </g>
      <g opacity="0.1">
        <path
          d="M1 19C1 9.05888 9.05888 1 19 1C28.9411 1 37 9.05888 37 19C37 28.9411 28.9411 37 19 37C9.05888 37 1 28.9411 1 19Z"
          stroke="#079455"
          strokeWidth="2"
        />
      </g>
      <g clipPath="url(#clip0_170_197213)">
        <path
          d="M15.2503 19.0003L17.7503 21.5003L22.7503 16.5003M27.3337 19.0003C27.3337 23.6027 23.6027 27.3337 19.0003 27.3337C14.398 27.3337 10.667 23.6027 10.667 19.0003C10.667 14.398 14.398 10.667 19.0003 10.667C23.6027 10.667 27.3337 14.398 27.3337 19.0003Z"
          stroke="#079455"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_170_197213">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(9 9)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  notificationError: (props: IconProps) => (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="0.3">
        <path
          d="M18.0001 30.5C11.0965 30.5 5.50008 24.9035 5.50008 18C5.50008 11.0964 11.0965 5.49996 18.0001 5.49996C24.9036 5.49996 30.5001 11.0964 30.5001 18C30.5001 24.9035 24.9036 30.5 18.0001 30.5Z"
          stroke="#D92D20"
          strokeWidth="2"
        />
      </g>
      <g opacity="0.1">
        <path
          d="M17.1667 1.33333H18.8333C27.5778 1.33333 34.6667 8.42216 34.6667 17.1667V18.8333C34.6667 27.5778 27.5778 34.6667 18.8333 34.6667H17.1667C8.42216 34.6667 1.33333 27.5778 1.33333 18.8333V17.1667C1.33333 8.42216 8.42216 1.33333 17.1667 1.33333Z"
          stroke="#D92D20"
          strokeWidth="2"
        />
      </g>
      <g clipPath="url(#clip0_1130_82861)">
        <path
          d="M18.0001 14.6666V18M18.0001 21.3333H18.0084M26.3334 18C26.3334 22.6023 22.6025 26.3333 18.0001 26.3333C13.3977 26.3333 9.66675 22.6023 9.66675 18C9.66675 13.3976 13.3977 9.66663 18.0001 9.66663C22.6025 9.66663 26.3334 13.3976 26.3334 18Z"
          stroke="#D92D20"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1130_82861">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(9 9)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  notificationInfo: (props: IconProps) => (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g opacity="0.3">
        <path
          d="M18.0001 30.5C11.0965 30.5 5.50008 24.9035 5.50008 18C5.50008 11.0964 11.0965 5.49996 18.0001 5.49996C24.9036 5.49996 30.5001 11.0964 30.5001 18C30.5001 24.9035 24.9036 30.5 18.0001 30.5Z"
          stroke="#8B949E"
          strokeWidth="2"
        />
      </g>
      <g opacity="0.1">
        <path
          d="M17.1667 1.33333H18.8333C27.5778 1.33333 34.6667 8.42216 34.6667 17.1667V18.8333C34.6667 27.5778 27.5778 34.6667 18.8333 34.6667H17.1667C8.42216 34.6667 1.33333 27.5778 1.33333 18.8333V17.1667C1.33333 8.42216 8.42216 1.33333 17.1667 1.33333Z"
          stroke="#8B949E"
          strokeWidth="2"
        />
      </g>
      <g clipPath="url(#clip0_1130_82861)">
        <path
          d="M18.0001 14.6666V18M18.0001 21.3333H18.0084M26.3334 18C26.3334 22.6023 22.6025 26.3333 18.0001 26.3333C13.3977 26.3333 9.66675 22.6023 9.66675 18C9.66675 13.3976 13.3977 9.66663 18.0001 9.66663C22.6025 9.66663 26.3334 13.3976 26.3334 18Z"
          stroke="#8B949E"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1130_82861">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(9 9)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  numberOneCircle: (props: IconProps) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.21484 0C3.80301 0 0.214844 3.58817 0.214844 8C0.214844 12.4118 3.80301 16 8.21484 16C12.6267 16 16.2148 12.4118 16.2148 8C16.2148 3.58817 12.6267 0 8.21484 0ZM8.21484 15.4218C4.12268 15.4218 0.79301 12.0922 0.79301 8C0.79301 3.90783 4.12268 0.578167 8.21484 0.578167C12.307 0.578167 15.6367 3.90783 15.6367 8C15.6367 12.0922 12.307 15.4218 8.21484 15.4218Z"
        fill="#FFFFFF"
      />
      <path
        d="M9.59446 2.81818V13H8.36151V4.1108H8.30185L5.81605 5.76136V4.50852L8.36151 2.81818H9.59446Z"
        fill="#FFFFFF"
      />
    </svg>
  ),
  numberTwoCircle: (props: IconProps) => (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.71484 0C4.30301 0 0.714844 3.58817 0.714844 8C0.714844 12.4118 4.30301 16 8.71484 16C13.1267 16 16.7148 12.4118 16.7148 8C16.7148 3.58817 13.1267 0 8.71484 0ZM8.71484 15.4218C4.62268 15.4218 1.29301 12.0922 1.29301 8C1.29301 3.90783 4.62268 0.578167 8.71484 0.578167C12.807 0.578167 16.1367 3.90783 16.1367 8C16.1367 12.0922 12.807 15.4218 8.71484 15.4218Z"
        fill="#FFFFFF"
      />
      <path
        d="M5.53054 13V12.1051L8.89134 8.42614C9.28575 7.99526 9.61056 7.62074 9.86577 7.30256C10.121 6.98106 10.3099 6.67945 10.4325 6.39773C10.5585 6.11269 10.6214 5.81439 10.6214 5.50284C10.6214 5.14489 10.5353 4.83499 10.3629 4.57315C10.1939 4.31132 9.96188 4.10914 9.6669 3.96662C9.37192 3.8241 9.04048 3.75284 8.67259 3.75284C8.28149 3.75284 7.9401 3.83404 7.64844 3.99645C7.36009 4.15554 7.13636 4.37926 6.97727 4.66761C6.8215 4.95597 6.74361 5.29403 6.74361 5.68182H5.57031C5.57031 5.08523 5.70786 4.56155 5.98295 4.1108C6.25805 3.66004 6.63258 3.30871 7.10653 3.05682C7.58381 2.80492 8.11908 2.67898 8.71236 2.67898C9.30895 2.67898 9.83759 2.80492 10.2983 3.05682C10.759 3.30871 11.1203 3.64844 11.3821 4.07599C11.6439 4.50355 11.7749 4.97917 11.7749 5.50284C11.7749 5.87737 11.7069 6.24361 11.571 6.60156C11.4384 6.9562 11.2064 7.35227 10.875 7.78977C10.5469 8.22396 10.0911 8.75426 9.50781 9.38068L7.22088 11.8267V11.9062H11.9538V13H5.53054Z"
        fill="#FFFFFF"
      />
    </svg>
  ),
  numberThreeCircle: (props: IconProps) => (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.21484 0C3.80301 0 0.214844 3.58817 0.214844 8C0.214844 12.4118 3.80301 16 8.21484 16C12.6267 16 16.2148 12.4118 16.2148 8C16.2148 3.58817 12.6267 0 8.21484 0ZM8.21484 15.4218C4.12268 15.4218 0.79301 12.0922 0.79301 8C0.79301 3.90783 4.12268 0.578167 8.21484 0.578167C12.307 0.578167 15.6367 3.90783 15.6367 8C15.6367 12.0922 12.307 15.4218 8.21484 15.4218Z"
        fill="#FFFFFF"
      />
      <path
        d="M8.25213 13.1392C7.59588 13.1392 7.01089 13.0265 6.49716 12.8011C5.98674 12.5758 5.58073 12.2625 5.27912 11.8615C4.98082 11.4571 4.81842 10.9882 4.7919 10.4545H6.04474C6.07126 10.7827 6.18395 11.0661 6.38281 11.3047C6.58168 11.54 6.84186 11.7223 7.16335 11.8516C7.48485 11.9808 7.84115 12.0455 8.23224 12.0455C8.66974 12.0455 9.05753 11.9692 9.3956 11.8168C9.73366 11.6643 9.99882 11.4522 10.1911 11.1804C10.3833 10.9086 10.4794 10.5938 10.4794 10.2358C10.4794 9.86127 10.3866 9.53149 10.201 9.24645C10.0154 8.9581 9.74361 8.73272 9.38565 8.57031C9.0277 8.40791 8.5902 8.3267 8.07315 8.3267H7.25781V7.23295H8.07315C8.47751 7.23295 8.83215 7.16004 9.13707 7.0142C9.44531 6.86837 9.68561 6.66288 9.85795 6.39773C10.0336 6.13258 10.1214 5.82102 10.1214 5.46307C10.1214 5.11837 10.0452 4.81842 9.89276 4.56321C9.74029 4.308 9.52486 4.10914 9.24645 3.96662C8.97135 3.8241 8.64654 3.75284 8.27202 3.75284C7.92069 3.75284 7.58925 3.81747 7.2777 3.94673C6.96946 4.07268 6.71757 4.25663 6.52202 4.49858C6.32647 4.73722 6.22041 5.02557 6.20384 5.36364H5.01065C5.03054 4.83002 5.19129 4.36269 5.4929 3.96165C5.79451 3.55729 6.18892 3.24242 6.67614 3.01705C7.16667 2.79167 7.70526 2.67898 8.2919 2.67898C8.92164 2.67898 9.46188 2.80658 9.91264 3.06179C10.3634 3.31368 10.7098 3.64678 10.9517 4.06108C11.1937 4.47538 11.3146 4.92282 11.3146 5.40341C11.3146 5.9768 11.1638 6.46567 10.8622 6.87003C10.5639 7.27438 10.1579 7.55445 9.64418 7.71023V7.78977C10.2872 7.89583 10.7893 8.16927 11.1506 8.61009C11.5118 9.04759 11.6925 9.58949 11.6925 10.2358C11.6925 10.7893 11.5417 11.2865 11.2401 11.7273C10.9418 12.1648 10.5341 12.5095 10.017 12.7614C9.5 13.0133 8.9117 13.1392 8.25213 13.1392Z"
        fill="#FFFFFF"
      />
    </svg>
  ),
  thumpsUp: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="lucide lucide-thumbs-up"
      {...props}
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  ),
  clock: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      stroke="currentColor"
      className="lucide lucide-clock-3"
      {...props}
    >
      <circle cx="8.5" cy="8" r="7.5" />
      <polyline points="8.5 4 8.5 8 11.75 8" />
    </svg>
  ),
  rocket: (props: IconProps) => (
    <svg
      width="23"
      height="24"
      viewBox="0 0 23 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="#52D4FC"
      {...props}
    >
      <path
        d="M12.6526 20.7359C12.5919 20.7241 12.5413 20.6825 12.5179 20.6254L12.6526 20.7359ZM12.6526 20.7359C12.7132 20.7477 12.7758 20.7282 12.8189 20.6841L12.6526 20.7359ZM13.7393 9.20913L13.3864 9.56329C13.8938 10.0689 14.5812 10.3524 15.2974 10.3517H15.2975C16.0138 10.3508 16.7004 10.0657 17.2067 9.55892L17.2068 9.55886C17.713 9.05198 17.9973 8.36501 17.9973 7.6487C17.9973 6.93243 17.713 6.24534 17.2068 5.73851L17.2067 5.73849C16.7005 5.23174 16.0138 4.94655 15.2975 4.94575L13.7393 9.20913ZM13.7393 9.20913L13.3864 9.56329C12.8774 9.0561 12.5914 8.36718 12.5914 7.6487C12.5914 6.93018 12.8774 6.24125 13.3864 5.73411C13.8937 5.22851 14.5811 4.94489 15.2974 4.94575L13.7393 9.20913ZM6.24168 7.98771L6.24437 7.9383L6.2431 7.98779L7.38378 8.04651L7.65164 8.0603L7.81128 7.84478C10.1652 4.66679 14.3124 1.4051 21.6159 0.506882L21.6159 0.506904L21.6206 0.506285C21.8446 0.476602 22.0695 0.553205 22.2289 0.713408C22.3882 0.873612 22.4636 1.09902 22.4328 1.32282L22.4327 1.32281L22.4318 1.33061C21.5408 8.63636 18.2817 12.7807 15.0945 15.1343L14.8773 15.2948L14.8923 15.5644L14.9558 16.7048C14.9558 16.7053 14.9559 16.7057 14.9559 16.7062C14.9899 17.3883 14.7361 18.0533 14.2567 18.5393L14.2449 18.5511L12.7987 19.9972L11.8024 17.5945L11.6139 17.1399L11.1564 17.3211C10.3734 17.6313 9.56691 17.8787 8.7446 18.0611C8.74404 18.0612 8.74348 18.0614 8.74292 18.0615L8.52277 18.1088L4.83819 14.422L4.88692 14.2006C4.88695 14.2004 4.88698 14.2003 4.88701 14.2001C5.06946 13.3775 5.31702 12.5706 5.62735 11.7871L5.80856 11.3296L5.354 11.1411L2.94263 10.1412L4.39548 8.68839C4.39581 8.68806 4.39614 8.68774 4.39647 8.68741C4.88535 8.20448 5.55544 7.95032 6.24168 7.98771ZM2.73342 16.7503C3.01413 16.7659 3.34913 16.8577 3.7424 17.0811C3.29344 17.5708 3.00672 18.1881 2.92223 18.8471L1.9575 18.5087C1.5427 18.3631 1.10495 18.3001 0.668662 18.3214C0.926252 17.8505 1.29019 17.3348 1.7601 17.0257C2.04754 16.8367 2.36705 16.7299 2.73342 16.7503ZM2.89795 19.3657C2.91112 19.7308 3.20356 20.0239 3.56842 20.0381C4.42596 20.0727 5.25451 19.7632 5.87641 19.1907C5.99229 19.3754 6.10836 19.6044 6.17704 19.857C6.29299 20.2835 6.27646 20.7728 5.86783 21.2772C5.48923 21.731 4.94753 22.018 4.3593 22.0762L4.3593 22.0761L4.35528 22.0766C3.82447 22.1334 3.05984 22.2491 2.31971 22.4693C1.7322 22.6441 1.10253 22.901 0.627084 23.2897C0.536463 22.8807 0.475085 22.3633 0.566569 21.7989C0.683828 21.0753 1.05834 20.2355 2.03297 19.429L2.89758 19.1588C2.89551 19.2271 2.8956 19.2956 2.8979 19.3643L2.89795 19.3657Z"
        fill="#52D4FC"
        stroke="black"
      />
    </svg>
  ),
  nudge: (props: IconProps) => (
    <svg
      width="17"
      height="14"
      viewBox="0 0 17 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M16.8346 4.39616C16.8346 3.24707 15.9004 2.31283 14.7513 2.31283H8.60547C8.48828 2.14355 8.35807 1.98079 8.2181 1.8278L7.61589 1.16699C7.07227 0.571289 6.30404 0.229492 5.49675 0.229492H5.16471C3.4069 0.229492 1.7793 1.16374 0.890625 2.68392L0.841797 2.76855C0.399089 3.52702 0.167969 4.38639 0.167969 5.26204V9.34408C0.167969 11.5023 1.91602 13.2503 4.07422 13.2503H4.33464H7.45964C8.60872 13.2503 9.54297 12.3161 9.54297 11.167C9.54297 11.0758 9.53646 10.9847 9.52669 10.8968C10.1582 10.5387 10.5846 9.86165 10.5846 9.08366C10.5846 8.91113 10.5618 8.74186 10.5228 8.5791C11.1803 8.22754 11.6263 7.53744 11.6263 6.73991C11.6263 6.65202 11.6198 6.56413 11.61 6.47949H14.7513C15.9004 6.47949 16.8346 5.54525 16.8346 4.39616ZM14.7513 3.87533C15.0378 3.87533 15.2721 4.1097 15.2721 4.39616C15.2721 4.68262 15.0378 4.91699 14.7513 4.91699H10.3242C9.98893 4.91699 9.68945 5.13184 9.58203 5.45085C9.47461 5.76986 9.58529 6.12142 9.85221 6.32324C9.97917 6.4209 10.0605 6.57064 10.0605 6.73991C10.0605 7.02637 9.82617 7.26074 9.53971 7.26074H9.2793C8.94401 7.26074 8.64453 7.47559 8.53711 7.7946C8.42969 8.11361 8.54037 8.46517 8.80729 8.66699C8.93425 8.76465 9.01562 8.91439 9.01562 9.08366C9.01562 9.37012 8.78125 9.60449 8.49479 9.60449C8.19857 9.60449 7.92839 9.77051 7.79492 10.0374C7.66146 10.3044 7.69076 10.6201 7.86979 10.8545C7.9349 10.9424 7.97396 11.0498 7.97396 11.167C7.97396 11.4535 7.73958 11.6878 7.45313 11.6878H4.32813H4.06771C2.77214 11.6878 1.72396 10.6396 1.72396 9.34408V5.26204C1.72396 4.66309 1.88346 4.07389 2.1862 3.55632L2.23503 3.47168C2.8405 2.43001 3.95378 1.79199 5.1582 1.79199H5.49023C5.85807 1.79199 6.20638 1.94824 6.45378 2.21842L7.02018 2.83366H5.63672C5.35026 2.83366 5.11589 3.06803 5.11589 3.35449C5.11589 3.64095 5.35026 3.87533 5.63672 3.87533H8.17578H8.24089H14.7513Z" />
    </svg>
  )
}
