import type { SxProps, Theme } from "@mui/material/styles";

export function combineSxProps(
    sxProps1: any,
    sxProps2: SxProps<Theme> | undefined
){
    return [
      sxProps1, 
      ...(Array.isArray(sxProps2) ? sxProps2 : [sxProps2]), 
     ]
}

