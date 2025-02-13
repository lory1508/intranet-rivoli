export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 150
      },
      errorMessage: "Il nome utente dev'essere di minimo 5 caratteri e massimo 150"
    },
    notEmpty: {
      errorMessage: "Il nome utente non può essere vuoto"
    },
  },
  firstname:{
    isLength: {
      options: {
        min: 2,
        max: 150
      },
      errorMessage: "Il nome dev'essere di minimo 2 caratteri e massimo 150"
    },
    notEmpty: {
      errorMessage: "Il nome non può essere vuoto"
    },
  },
  lastname:{
    isLength: {
      options: {
        min: 2,
        max: 150
      },
      errorMessage: "Il nome utente dev'essere di minimo 2 caratteri e massimo 150"
    },
    notEmpty: {
      errorMessage: "Il nome utente non può essere vuoto"
    },
  },
  phone:{},
  fax:{},
  email:{
    notEmpty: {
      errorMessage: "L'indirizzo email non può essere vuoto"
    }
  },
  room:{
    notEmpty: {
      errorMessage: "La stanza non può essere vuota"
    },
  },
  department_id:{
    notEmpty: {
      errorMessage: "La direzione non può essere vuota"
    },
  },
  service_id:{},
  office_id:{
    notEmpty: {
      errorMessage: "L'ufficio non può essere vuoto"
    },
  },
  address:{},
  image:{},
  enabled:{},
  admin:{},
}

export const createDepartmentValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 5,
        max: 150
      },
      errorMessage: "Il nome della direzione dev'essere di almeno 5 caratteri e massimo 150"
    },
    notEmpty: {
      errorMessage: "Il nome non può essere vuoto"
    },
  },
}

export const createServiceValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 5,
        max: 150
      },
      errorMessage: "Il nome della direzione dev'essere di almeno 5 caratteri e massimo 150"
    },
    notEmpty: {
      errorMessage: "Il nome non può essere vuoto"
    },
  },
  department_id: {
    notEmpty: {
      errorMessage: "La direzione non può essere vuota"
    },
  },
}

export const createOfficeValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 5,
        max: 150
      },
      errorMessage: "Il nome della direzione dev'essere di almeno 5 caratteri e massimo 150"
    },
    notEmpty: {
      errorMessage: "Il nome non può essere vuoto"
    },
  },
  department_id: {
    notEmpty: {
      errorMessage: "La direzione non può essere vuota"
    },
  },
  service_id: {},
}

export const createNewsValidationSchema = {
  title: {
    isLength: {
      options: {
        min: 5,
        max: 150
      },
      errorMessage: "Il titolo dev'essere di almeno 5 caratteri e massimo 150"
    },
    notEmpty: {
      errorMessage: "Il titolo non può essere vuoto"
    },
  },
  date_from: {
    notEmpty: {
      errorMessage: "La data di inizio non può essere vuota"
    },
  },
  date_to: {},
  content: {},
  category_id: {},
  tag_ids: {},
  visible: {},
  highlighted: {},
  images: [],
  attachments: [],
}

export const createNewsCategoryValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 2,
        max: 150
      },
      errorMessage: "Il titolo dev'essere di almeno 2 caratteri e massimo 150"
    },
    notEmpty: {
      errorMessage: "Il titolo non può essere vuoto"
    },
  },
}

export const createNewsTagValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 2,
        max: 150
      },
      errorMessage: "Il titolo dev'essere di almeno 2 caratteri e massimo 150"
    },
    notEmpty: {
      errorMessage: "Il titolo non può essere vuoto"
    },
  },
}