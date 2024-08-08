export default {
    auth: {
        guest: true,
        checked: false,
    },
    siteinfo: {
        title: "",
        subtitle: "",
        logo: {
            file: "",
            thumbnail: "",
            caption: "",
        },
        currencyISOCode: "",
        paymentMethod: "",
        stripeKey: "",
        codeInjectionHead: "",
        codeInjectionBody: "",
        mailingAddress: "",
        hideCourseLitBranding: false,
    },
    networkAction: false,
    profile: {
        name: "",
        id: "",
        fetched: false,
        purchases: [],
        email: "",
        bio: "",
        permissions: [],
        userId: "",
        avatar: {
            file: "",
            thumbnail: "",
            caption: "",
        },
    },
    message: {
        open: false,
        message: "",
        action: null,
    },
    theme: {},
    address: {
        backend: "",
        frontend: "",
    },
    typefaces: [],
};
