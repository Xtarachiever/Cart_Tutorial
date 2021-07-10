import React,{ Component } from 'react';
import { CardActions,IconButton,Card,CardMedia,Typography,CardContent } from '@material-ui/core';
import piled_clothes from '../Assets/cloth_bulk.png';

class Main extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="container">
                <Card>
                    <CardMedia image={piled_clothes} title="cloth"/>
                    <CardContent>
                        <div>
                            <Typography variant="h4" gutterBottom>
                                Piled Clothes
                            </Typography>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
};
export default Main;