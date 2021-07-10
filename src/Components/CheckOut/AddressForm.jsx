import React,{useState,useEffect} from 'react';
import { InputLabel,Select, MenuItem, Grid, Typography,Button } from '@material-ui/core';
import {Link} from 'react-router-dom';

import {commerce} from '../../lib/commerce'
import { useForm,FormProvider } from 'react-hook-form';
import FormInput from './CustomTextField';

const AddressForm = ({checkOut,next}) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubDivisions, setShippingSubDivisions] = useState([]);
    const [shippingSubDivision, setShippingSubDivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');
    const methods= useForm();

    const objectFile= Object.entries(shippingCountries).map(([code,name])=>({id:code,label:name}));
    const subDivisionFile= Object.entries(shippingSubDivisions).map(([code,name])=>({id:code,label:name}));
    const options=shippingOptions.map(sO=>({id:sO.id,label:`${sO.description} - (${sO.price.formatted_with_symbol})`}))

    const fetchShippingCountries= async(checkOutTokenId)=>{
        const {countries}=await commerce.services.localeListShippingCountries(checkOutTokenId);
        setShippingCountries(countries)
        setShippingCountry(Object.keys(countries)[0])
    }
    const fetchSubDivisions=async (countryCode)=>{
        const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode);
        setShippingSubDivisions(subdivisions);
        setShippingSubDivision(Object.keys(subdivisions)[0])
    }
    
    const fetchShippingOptions= async (checkoutTokenId, country, region=null)=>{
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId,{country,region});
        setShippingOptions(options)
        setShippingOption(options[0].id);
    }


    useEffect(() => {
        fetchShippingCountries(checkOut.id);
    }, [])

    // commerce.services.localeListSubdivisions('US').then((response) => console.log(response));
    useEffect(() => {
        if(shippingCountry) fetchSubDivisions(shippingCountry);
    }, [shippingCountry])

    useEffect(() => {
        if(shippingSubDivision) fetchShippingOptions(checkOut.id,shippingCountry,shippingSubDivision)
    }, [shippingSubDivision])

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Shipping Address
            </Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data)=>next({...data,shippingOption,shippingSubDivision,shippingCountry}))}>
                    <Grid container spacing={3}>
                        <FormInput name="firstName" label="First Name"/>
                        <FormInput name="lastName" label="Last Name"/>
                        <FormInput name="address1" label="Address"/>
                        <FormInput name="email" label="Email"/>
                        <FormInput name="city" label="City"/>
                        <FormInput name="zip" label="ZIP/ Postal code"/>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e)=>setShippingCountry(e.target.value)}>
                                {
                                    objectFile.map(country=>(
                                        <MenuItem key={country.id} value={country.id}>
                                            {country.label}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select value={shippingSubDivision} fullWidth onChange={(e)=>setShippingSubDivision(e.target.value)}>
                                {
                                    subDivisionFile.map((subdivisions)=>(
                                        <MenuItem key={subdivisions.id} value={subdivisions.id}>
                                            {subdivisions.label}
                                         </MenuItem>
                                    ))
                                }
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e)=>setShippingOption(e.target.value)}>
                                {options.map(option=>(
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <br/>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                            <Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
                            <Button type="submit" variant="contained">Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
