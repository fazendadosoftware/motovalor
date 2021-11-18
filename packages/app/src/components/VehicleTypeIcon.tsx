import React from 'react'
import { View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const VehicleTypeIcon: React.FC<{ vehicleTypeId: 1 | 2 | 3, backgroundColor?: string, color?: string, size?: number }> = props => {
  let element
  const { vehicleTypeId, backgroundColor = 'white', color = 'black', size = 50 } = props
  switch (vehicleTypeId) {
  case 1:
    element = <Svg width="100%" height="100%" viewBox="0 0 34 27">
      <Path d="M7.8125 15.7142C7.8125 14.9941 7.5575 14.3775 7.0475 13.8646C6.53758 13.3517 5.9245 13.0952 5.20833 13.0952C4.49217 13.0952 3.87908 13.3517 3.36917 13.8646C2.85917 14.3775 2.60417 14.9941 2.60417 15.7142C2.60417 16.4345 2.85917 17.0511 3.36917 17.564C3.87908 18.0769 4.49217 18.3333 5.20833 18.3333C5.9245 18.3333 6.53758 18.0769 7.0475 17.564C7.5575 17.0511 7.8125 16.4345 7.8125 15.7142ZM8.39842 10.4762H24.9349L23.4863 4.63242C23.4647 4.54517 23.3887 4.44967 23.2585 4.346C23.1282 4.24233 23.0143 4.1905 22.9167 4.1905H10.4167C10.319 4.1905 10.2051 4.24233 10.0748 4.346C9.94466 4.44967 9.86867 4.54517 9.847 4.63242L8.39842 10.4762ZM30.7292 15.7142C30.7292 14.9941 30.4742 14.3775 29.9642 13.8646C29.4542 13.3517 28.8412 13.0952 28.125 13.0952C27.4088 13.0952 26.7957 13.3517 26.2858 13.8646C25.7758 14.3775 25.5208 14.9941 25.5208 15.7142C25.5208 16.4345 25.7758 17.0511 26.2858 17.564C26.7957 18.0769 27.4088 18.3333 28.125 18.3333C28.8412 18.3333 29.4542 18.0769 29.9642 17.564C30.4742 17.0511 30.7292 16.4345 30.7292 15.7142ZM33.3333 14.1428V20.4286C33.3333 20.5813 33.2845 20.7068 33.1868 20.8051C33.0892 20.9032 32.9644 20.9524 32.8125 20.9524H31.25V23.0476C31.25 23.9207 30.9462 24.6627 30.3385 25.2738C29.7309 25.8849 28.9931 26.1905 28.125 26.1905C27.2569 26.1905 26.5191 25.8849 25.9115 25.2738C25.3038 24.6627 25 23.9207 25 23.0476V20.9524H8.33333V23.0476C8.33333 23.9207 8.0295 24.6627 7.42183 25.2738C6.81425 25.8849 6.07642 26.1905 5.20833 26.1905C4.34025 26.1905 3.60242 25.8849 2.99483 25.2738C2.38717 24.6627 2.08333 23.9207 2.08333 23.0476V20.9524H0.520833C0.368917 20.9524 0.244167 20.9032 0.1465 20.8051C0.0488336 20.7068 0 20.5813 0 20.4286V14.1428C0 13.128 0.355333 12.2632 1.06608 11.5483C1.77683 10.8336 2.63675 10.4762 3.64583 10.4762H4.10158L5.81058 3.61758C6.06008 2.59175 6.62433 1.73242 7.50325 1.03942C8.38217 0.3465 9.35333 0 10.4167 0H22.9167C23.98 0 24.9512 0.3465 25.8301 1.03942C26.709 1.73242 27.2732 2.59175 27.5227 3.61758L29.2317 10.4762H29.6875C30.6966 10.4762 31.5565 10.8336 32.2672 11.5483C32.978 12.2632 33.3333 13.128 33.3333 14.1428Z" fill={ color } />
    </Svg>
    break
  case 2:
    element = <Svg width="100%" height="100%" viewBox="0 0 34 19" >
      <Path d="M33.2881 11.2839C33.4037 12.2773 33.2977 13.2345 32.9697 14.1556C32.6418 15.0766 32.1645 15.865 31.5376 16.5208C30.9107 17.1767 30.1463 17.6878 29.2446 18.0543C28.3428 18.4208 27.3952 18.5703 26.4018 18.5028C24.8491 18.3967 23.5012 17.7939 22.3584 16.6944C21.2155 15.595 20.5669 14.2737 20.4126 12.7306C20.2969 11.6601 20.4295 10.645 20.8104 9.68542C21.1914 8.72575 21.7628 7.90358 22.5247 7.21883L21.4976 5.67092C20.5717 6.44242 19.8436 7.378 19.3132 8.47742C18.7827 9.57692 18.5175 10.7535 18.5175 12.0073C18.5175 12.2677 18.4282 12.4919 18.2498 12.68C18.0714 12.868 17.852 12.9621 17.5916 12.9621H12.8899C12.6681 14.5438 11.9496 15.865 10.7343 16.9259C9.51917 17.9868 8.10142 18.5173 6.48108 18.5173C4.69692 18.5173 3.17067 17.8831 1.90242 16.6149C0.634166 15.3467 0 13.8204 0 12.0362C0 10.252 0.634166 8.72575 1.90242 7.4575C3.17067 6.18925 4.69692 5.55517 6.48108 5.55517C7.21408 5.55517 7.94708 5.68533 8.68008 5.94575L9.02725 5.29475C7.841 4.23392 6.375 3.70342 4.62933 3.70342H3.7035C3.45275 3.70342 3.23575 3.61183 3.0525 3.42858C2.86925 3.24533 2.77758 3.02833 2.77758 2.77758C2.77758 2.52683 2.86925 2.30983 3.0525 2.12658C3.23575 1.94333 3.45275 1.85175 3.7035 1.85175H5.55525C6.3075 1.85175 7.00675 1.91683 7.65292 2.047C8.29908 2.17725 8.86091 2.36292 9.33833 2.604C9.81566 2.84508 10.1605 3.03558 10.3727 3.17542C10.5848 3.31525 10.8307 3.49125 11.1105 3.70342H20.1812L18.9515 1.85175H15.7398C15.4505 1.85175 15.2142 1.74325 15.031 1.52625C14.8477 1.30925 14.7802 1.05608 14.8284 0.766749C14.867 0.544916 14.9779 0.361667 15.1612 0.217001C15.3444 0.072334 15.5517 0 15.7832 0H19.4433C19.7616 0 20.0172 0.134999 20.2101 0.405083L21.2227 1.92408L22.872 0.274833C23.0552 0.0915831 23.277 0 23.5374 0H24.9986C25.2493 0 25.4663 0.0915831 25.6496 0.274833C25.8328 0.458083 25.9245 0.675083 25.9245 0.925833V2.77758C25.9245 3.02833 25.8328 3.24533 25.6496 3.42858C25.4663 3.61183 25.2493 3.70342 24.9986 3.70342H22.409L24.0727 6.19167C25.3362 5.58408 26.6622 5.4105 28.0511 5.67092C29.4302 5.92167 30.6068 6.57025 31.581 7.61667C32.5551 8.66308 33.1241 9.8855 33.2881 11.2839ZM6.48108 16.6655C7.59025 16.6655 8.56916 16.3159 9.41783 15.6167C10.2666 14.9175 10.8018 14.0326 11.0237 12.9621H6.48108C6.14358 12.9621 5.87833 12.8126 5.68542 12.5136C5.51183 12.205 5.507 11.9012 5.671 11.6022L7.79758 7.595C7.34433 7.46958 6.9055 7.40692 6.48108 7.40692C5.208 7.40692 4.11825 7.86017 3.21158 8.76675C2.305 9.67333 1.85175 10.7632 1.85175 12.0362C1.85175 13.3093 2.305 14.3991 3.21158 15.3057C4.11825 16.2123 5.208 16.6655 6.48108 16.6655ZM26.8503 16.6655C28.1234 16.6655 29.2132 16.2123 30.1198 15.3057C31.0264 14.3991 31.4797 13.3093 31.4797 12.0362C31.4797 10.7632 31.0264 9.67333 30.1198 8.76675C29.2132 7.86017 28.1234 7.40692 26.8503 7.40692C26.2717 7.40692 25.6882 7.52267 25.0998 7.75408L27.6171 11.5154C27.7617 11.7373 27.81 11.9735 27.7617 12.2243C27.7135 12.475 27.5833 12.6679 27.3712 12.8029C27.2265 12.909 27.0528 12.9621 26.8503 12.9621C26.5127 12.9621 26.2572 12.8223 26.0836 12.5425L23.5664 8.78125C22.6694 9.69742 22.221 10.7824 22.221 12.0362C22.221 13.3093 22.6742 14.3991 23.5808 15.3057C24.4874 16.2123 25.5772 16.6655 26.8503 16.6655Z" fill={ color } />
    </Svg>
    break
  case 3:
    element = <Svg width="100%" height="100%" viewBox="0 0 33 27">
      <Path d="M21.4286 21.4286C21.4286 20.7837 21.6642 20.2257 22.1354 19.7545C22.6066 19.2832 23.1647 19.0476 23.8095 19.0476C24.4543 19.0476 25.0124 19.2832 25.4836 19.7545C25.9548 20.2257 26.1904 20.7837 26.1904 21.4286C26.1904 22.0734 25.9548 22.6314 25.4836 23.1027C25.0124 23.5739 24.4543 23.8095 23.8095 23.8095C23.1647 23.8095 22.6066 23.5739 22.1354 23.1027C21.6642 22.6314 21.4286 22.0734 21.4286 21.4286ZM28.5714 11.9047H21.4286V7.14283H24.3675C24.5288 7.14283 24.6652 7.19867 24.7768 7.31025L28.404 10.9375C28.5156 11.0491 28.5714 11.1855 28.5714 11.3467V11.9047ZM4.76192 21.4286C4.76192 20.7837 4.9975 20.2257 5.46875 19.7545C5.93992 19.2832 6.498 19.0476 7.14283 19.0476C7.78767 19.0476 8.34575 19.2832 8.81692 19.7545C9.28817 20.2257 9.52375 20.7837 9.52375 21.4286C9.52375 22.0734 9.28817 22.6314 8.81692 23.1027C8.34575 23.5739 7.78767 23.8095 7.14283 23.8095C6.498 23.8095 5.93992 23.5739 5.46875 23.1027C4.9975 22.6314 4.76192 22.0734 4.76192 21.4286ZM0 1.1905V20.2381C0 20.4241 0.0247501 20.5884 0.0744168 20.731C0.124 20.8737 0.207666 20.9883 0.325499 21.0752C0.443333 21.1619 0.545583 21.2332 0.632416 21.2891C0.71925 21.3448 0.864916 21.3821 1.06958 21.4007C1.27417 21.4192 1.41367 21.4317 1.48808 21.4378C1.5625 21.4441 1.72058 21.4441 1.96242 21.4378C2.20425 21.4317 2.34375 21.4286 2.38092 21.4286C2.38092 22.7431 2.846 23.8653 3.776 24.7954C4.70608 25.7254 5.82833 26.1905 7.14283 26.1905C8.45733 26.1905 9.57958 25.7254 10.5097 24.7954C11.4397 23.8653 11.9048 22.7431 11.9048 21.4286H19.0476C19.0476 22.7431 19.5127 23.8653 20.4427 24.7954C21.3728 25.7254 22.495 26.1905 23.8095 26.1905C25.124 26.1905 26.2463 25.7254 27.1763 24.7954C28.1063 23.8653 28.5714 22.7431 28.5714 21.4286H29.7619C29.7991 21.4286 29.9386 21.4317 30.1804 21.4378C30.4223 21.4441 30.5803 21.4441 30.6547 21.4378C30.7292 21.4317 30.8687 21.4192 31.0733 21.4007C31.2779 21.3821 31.4236 21.3448 31.5104 21.2891C31.5972 21.2332 31.6995 21.1619 31.8173 21.0752C31.9351 20.9883 32.0188 20.8737 32.0684 20.731C32.118 20.5884 32.1428 20.4241 32.1428 20.2381C32.1428 19.9157 32.025 19.6367 31.7894 19.401C31.5538 19.1654 31.2748 19.0476 30.9523 19.0476V13.0952C30.9523 12.996 30.9554 12.779 30.9617 12.4442C30.9678 12.1093 30.9678 11.8737 30.9617 11.7373C30.9554 11.6009 30.9399 11.387 30.9152 11.0956C30.8903 10.8042 30.8501 10.5747 30.7943 10.4073C30.7384 10.2399 30.6517 10.0508 30.5338 9.84C30.416 9.62925 30.2765 9.44317 30.1153 9.282L26.4323 5.59892C26.1967 5.36333 25.8835 5.16492 25.4929 5.00375C25.1023 4.8425 24.7396 4.76192 24.4047 4.76192H21.4286V1.1905C21.4286 0.868084 21.3108 0.589 21.0752 0.353417C20.8395 0.117833 20.5605 0 20.2381 0H1.19042C0.867999 0 0.589 0.117833 0.353417 0.353417C0.11775 0.589 0 0.868084 0 1.1905Z" fill={ color } />
    </Svg>

    break
  }
  const style = { padding: size / 10, backgroundColor, width: size, height: size, borderRadius: size }
  return <View style={ style }>{ element }</View>
}

export default VehicleTypeIcon