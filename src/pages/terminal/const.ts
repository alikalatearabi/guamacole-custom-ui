export const GUAC_BASE_URL = 'localhost:80/guacamole'
export const serverConnectionUrl = (id: string, token: string, width: number, height: number) => {
    return `ws://${GUAC_BASE_URL}/websocket-tunnel?token=${token}&GUAC_DATA_SOURCE=mysql&GUAC_ID=${id}` +
        `&GUAC_TYPE=c&GUAC_WIDTH=${width}&GUAC_HEIGHT=${height}&GUAC_DPI=96&GUAC_TIMEZONE=Asia%2FTehran&GUAC_AUDIO=audio%` +
        `2FL8&GUAC_AUDIO=audio%2FL16&GUAC_IMAGE=image%2Fjpeg&GUAC_IMAGE=image%2Fpng&GUAC_IMAGE=image%2Fwebp`
}