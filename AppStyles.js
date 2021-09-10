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
        backgroundColor: Colors.darker
    },
    main: {
        width: '100%',
        height: '100%'
    },
    button: {
        marginVertical: 15,
        backgroundColor: "#00F",
        padding: 10
    },
    iconButtonContainer: {
        margin: 8,
        backgroundColor: "#00F",
        padding: 20,
        borderRadius: 8
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
});