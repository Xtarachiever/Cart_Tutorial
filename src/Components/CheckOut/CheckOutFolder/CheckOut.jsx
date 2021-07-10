import React,{useState,useEffect} from 'react';
import {Paper,Stepper,Step,StepLabel,Typography,CircularProgress,Divider,Button,CssBaseline} from '@material-ui/core'
import useStyles from '../styles';
import {Link,useHistory} from 'react-router-dom';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';

import { commerce } from '../../../lib/commerce';

const steps=['Shipping address','Payment details']

const CheckOut = ({cart,order,onCaptureCheckout,error,refreshCart}) => {
    const history=useHistory();
    const classes=useStyles();
    const [activeStep,setActiveStep]=useState(0);
    const [checkOut,setCheckOut]=useState(null)
    const [shippingData,setShippingData]=useState({})
    const [isFinished,setIsFinished]=useState(false)


    console.log(order.customer)
    useEffect(() => {
        const generateToken=async()=>{
            try{
                 const token=await commerce.checkout.generateToken(cart.id,{type:'cart'});
                 console.log(token);
                 
                 setCheckOut(token);
            }
            catch(error){
                console.log(error)
                // history.pushState('/')
            }
        }
        generateToken();
    }, []);

    const nextStep=()=>setActiveStep((prevStep)=>prevStep + 1)
    const backStep=()=>setActiveStep((prevStep)=>prevStep - 1)

    const next=(data)=>{
        setShippingData(data)
        nextStep();
    }

    const timeOut=()=>{
        setTimeout(() => {
            setIsFinished(true)
        }, 3000);
    }

    const Form=()=>(
        activeStep===0 ? <AddressForm checkOut={checkOut} next={next}/> : <PaymentForm checkOut={checkOut} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} backStep={backStep} timeOut={timeOut} refreshCart={refreshCart}/>
    )

    let Confirmation=()=>order.customer ?(
        <>
            <div>
                <Typography variant="h5">
                    Thank You for your purchase, {order.customer.firstname} {order.customer.lastname}
                </Typography>
                <Divider className={classes.divider}/>
                <Typography variant="subtitle2">Order Ref: {order.customer_reference}</Typography>
            </div>
            <br/>
            <Button variant="outlined" type="button" component={Link} to="/">Back To Home</Button>
        </>
    ): isFinished ? (
        <div>
             <div>
            <Typography variant="h5">
                Thank You for your purchase
            </Typography>
            </div>
            <br/>
            <Button variant="outlined" type="button" component={Link} to="/">Back To Home</Button>
        </div>
    ):
    (
        <div className={classes.spinner}>
            <CircularProgress/>
        </div>
    );

    if(error){
        <>
            <Typography variant="h5">Error: {error}</Typography>
            <br/>
            <Button variant="outlined" type="button" component={Link} to="/">Back To Home</Button>
        </>
    }
    return (
        <>
        <CssBaseline/>
          <div className={classes.toolbar}/>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">
                        Checkout
                    </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step)=>(
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep===steps.length ? <Confirmation/>: checkOut && <Form/>}
                </Paper>
            </main>  
        </>
    )
}

export default CheckOut;
