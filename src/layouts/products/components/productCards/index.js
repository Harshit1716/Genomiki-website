import * as React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import IMAGE1 from "../../../../assets/images/logos/onquerCover.png";
import IMAGE2 from "../../../../assets/images/logos/inherigeneCover.png";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "store/loginSlice";
import { setInitialData } from "store/fileUploadSlice";

const ResponsiveCard = ({
  image,
  title,
  description,
  buttonText,
  onClick,
  isFirst,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        width: isMobile ? "90vw" : 370,
        margin: "auto",
        mt: isMobile ? (isFirst ? 14 : 4) : 6,
        borderRadius: 3,
        boxShadow: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: isMobile ? 320 : 320,
          objectFit: "cover",
        }}
        image={image}
        alt={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5">
          {title}
        </Typography>
        <Typography style={{ fontSize: 12 }} color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onClick} disabled={!onClick}>
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
};

export function Onquer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.login);
  return (
    <ResponsiveCard
      image={IMAGE1}
      title="Onquer™"
      description="OnQUER™ is an advanced interpretation and reporting solution that uncovers the genetic changes driving cancer, helping doctors understand the disease better and choose the most effective treatments. By analyzing a patient’s DNA, it provides clear insights and highlights therapy options tailored to each individual. With a comprehensive clinical report and smart technology, OnQUER™ supports confident, personalized decisions in cancer care."
      buttonText="Explore"
      onClick={() => {
        dispatch(addProduct("Onquer"));
        dispatch(setInitialData({ product: "Onquer", email: user.email }));
        navigate("/dashboard");
      }}
      isFirst={true}
    />
  );
}

export function InheriGene() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.login);
  return (
    <ResponsiveCard
      image={IMAGE2}
      title="InheriGene™"
      description="InheriGene™ supports the diagnosis of rare genetic disorders in individuals of any age with unclear or complex medical symptoms. It brings together the symptoms, family history, and cutting-edge genetic analysis to help doctors find answers faster. InheriGene supports clearer diagnosis and smarter care, giving individuals and their doctor the insights needed for a more personalized treatment path."
      buttonText="Explore"
      onClick={() => {
        dispatch(addProduct("Inherigene"));
        dispatch(setInitialData({ product: "Inherigene", email: user.email }));
        navigate("/dashboard");
      }}
    />
  );
}
