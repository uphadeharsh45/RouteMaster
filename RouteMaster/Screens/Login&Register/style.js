import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'green',
  },
  container:{
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FFF6E9'
  },
  bg:{
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
    width:'100%',
    height:300,
    opacity:0.3
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
    width:25
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding:20,
  },
  logo:{
    marginTop:20,
    height: 100,
    width: 100,
  },
  logo1:{
    marginTop:-20,
    height: 100,
    width: 100,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'gold',
    borderRadius: 12,
  },
  textInput: {
    flex: 1,
    marginTop: -4,

    color: '#05375a',
  },
  loginContainer: {
    width:'90%',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    margin:20,
    shadowColor:'gold',
    elevation:2,
    shadowOpacity:1
  },
  header: {
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  text_header: {
    color: '#18b152',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign:'center'
  },
  loginbutton: {
    alignItems: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 20
  },
  registerbutton: {
    alignItems: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 20
  },
  button: {
    alignItems: 'center',
    marginTop: -20,
    alignItems: 'center',
    textAlign: 'center',
    margin: 20,
  },
  inBut: {
    width: '70%',
    backgroundColor: '#18b152',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
  },
  inBut2: {
    backgroundColor: '#fff',
    height: 65,
    width: 65,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleimg:{
    height:65,
    width:65
  },
  smallIcon2: {
    fontSize: 40,
    // marginRight: 10,
  },
  bottomText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  radioButton_div: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioButton_inner_div: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton_title: {
    fontSize: 20,
    color: '#420475',
  },
  radioButton_text: {
    fontSize: 16,
    color: 'black',
  },
});
export default styles;