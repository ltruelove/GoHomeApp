import {
    StyleSheet
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

export default StyleSheet.create({
    testView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f00'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.darker,
        width: '100%'
    },
    leftContent: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: Colors.darker,
        marginTop: 50
    },
    leftContentIndent: {
        marginLeft: 10
    },
    main: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.darker
    },
    button: {
        marginVertical: 15,
        backgroundColor: "#00F",
        padding: 10
    },
    garageButton: {
        marginVertical: 10,
        backgroundColor: "#00F",
        padding: 10
    },
    iconButtonContainer: {
        alignItems: 'center',
        margin: 8,
        backgroundColor: "#00F",
        padding: 20,
        borderRadius: 8,
        minWidth: 200
    },
    iconButton: {
        color: "#FFF",
        fontSize: 40,
        width: 50,
        height: 50
    },
    textButton: {
        color: '#FFF',
        fontSize: 14
    },
    textBody: {
        color: '#FFF',
        fontSize: 14
    },
    textInput: {
        marginVertical: 8,
        marginBottom: 25,
        padding: 10,
        height: 40,
        color: '#333',
        backgroundColor: '#FFF',
        width: 300
    },
    switch: {
        marginTop: 10
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    textHeader: {
        color: "#FFF",
        fontSize: 28,
        marginTop: 15
    },
    roomList: {
        marginTop: 5,
    }
});